import OpenAI from "openai/index";
import { getRepository } from "fireorm";
import { Thread } from "~/server/models/thread.model";
import { getServerSession } from "#auth";
import { ThreadFindResponse } from "~/core/dto/thread.find.response";

export default defineEventHandler(
  async (event): Promise<ThreadFindResponse | null> => {
    const session = await getServerSession(event);
    const openai = new OpenAI();
    const thread = await openai.beta.threads.create();
    const threadRepository = getRepository(Thread);
    if (session?.user) {
      return await threadRepository.create({
        id: thread.id,
        title: "New chat",
        userId: session?.user?.id,
        createdAt: thread.created_at,
      });
    }

    return null;
  },
);
