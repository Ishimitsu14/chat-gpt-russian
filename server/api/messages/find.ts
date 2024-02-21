import type { MessageFindResponse } from "~/core/dto/message.find.response";
import { getRepository } from "fireorm";
import { Message } from "~/server/models/message.model";

export default defineEventHandler(
  async (event): Promise<MessageFindResponse[]> => {
    const query = await getQuery(event);
    const messageRepository = getRepository(Message);
    if (query.threadId && typeof query.threadId === "string") {
      return await messageRepository
        .whereEqualTo("threadId", query.threadId)
        .orderByAscending("createdAt")
        .find();
    }

    return [];
  },
);
