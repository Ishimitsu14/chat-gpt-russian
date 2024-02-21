import OpenAI from "openai";
import { getRepository } from "fireorm";
import { Thread } from "~/server/models/thread.model";
import { Message } from "~/server/models/message.model";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const openai = new OpenAI();
  if (body.threadId) {
    openai.beta.threads.del(body.threadId);
    const threadRepository = getRepository(Thread);
    threadRepository.delete(body.threadId);
    const messageRepository = getRepository(Message);
    const messages = await messageRepository
      .whereEqualTo("threadId", body.threadId)
      .find();
    for (const message of messages) {
      messageRepository.delete(message.id);
      console.log(message.id);
    }
  }
});
