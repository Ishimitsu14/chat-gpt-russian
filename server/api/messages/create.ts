import OpenAI from "openai";
import { getServerSession } from "#auth";
import { getRepository } from "fireorm";
import { Message, MessageRole } from "~/server/models/message.model";
import { sleep } from "openai/core";
import { MessageFindResponse } from "~/core/dto/message.find.response";
import { Thread } from "~/server/models/thread.model";

export default defineEventHandler(
  async (event): Promise<MessageFindResponse[]> => {
    const session = await getServerSession(event);
    const openai = new OpenAI();
    const body = await readBody(event);
    const messageRepository = getRepository(Message);
    const openaiMessageFromUser = await openai.beta.threads.messages.create(
      body.threadId,
      {
        role: "user",
        content: body.message,
        metadata: {
          userId: session?.user.id,
          email: session?.user.email,
        },
      },
    );
    const messageFromUser = await messageRepository.create({
      id: openaiMessageFromUser.id,
      threadId: body.threadId,
      text: body.message,
      createdAt: openaiMessageFromUser.created_at,
      role: MessageRole.USER,
    });

    let run = await openai.beta.threads.runs.create(body.threadId, {
      assistant_id: "asst_sn6knv7KTmFnAonAxRwA4JPg",
    });

    while (run.status !== "completed" && run.status !== "failed") {
      await sleep(1500);
      run = await openai.beta.threads.runs.retrieve(body.threadId, run.id);
    }

    const messagesList = await openai.beta.threads.messages.list(
      body.threadId,
      {
        limit: 1,
      },
    );

    const openAiMessageFromAssistant = messagesList.data[0];

    if (openAiMessageFromAssistant.content[0].type === "text") {
      const messageFromAssistant = await messageRepository.create({
        id: openAiMessageFromAssistant.id,
        threadId: body.threadId,
        text: openAiMessageFromAssistant.content[0].text.value,
        createdAt: openAiMessageFromAssistant.created_at,
        role: MessageRole.ASSISTANT,
      });

      console.log(body.isCreateTitle);

      if (body.isCreateTitle) {
        const result = await openai.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `Придумай название диалогу по ключевым словам, на английском: 
            Вопрос: ${messageFromUser.text}
            Ответ: ${messageFromAssistant.text}`,
            },
          ],
          model: "gpt-3.5-turbo",
        });

        const threadRepository = getRepository(Thread);
        const thread = await threadRepository.findById(body.threadId);
        let answer = result.choices[0].message.content;
        if (answer && answer.startsWith('"') && answer.endsWith('"')) {
          answer = answer.slice(1, -1);
        }
        thread.title = answer || "";
        await threadRepository.update(thread);
      }

      return [messageFromUser, messageFromAssistant];
    }

    return [];
  },
);
