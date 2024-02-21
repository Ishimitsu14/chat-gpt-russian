import { getRepository } from "fireorm";
import { Thread } from "~/server/models/thread.model";
import { getServerSession } from "#auth";
import { ThreadFindResponse } from "~/core/dto/thread.find.response";

export default defineEventHandler(
  async (event): Promise<ThreadFindResponse[]> => {
    const session = await getServerSession(event);
    const threadRepository = getRepository(Thread);
    if (session) {
      return await threadRepository
        .whereEqualTo("userId", session.user.id)
        .find();
    }

    return [];
  },
);
