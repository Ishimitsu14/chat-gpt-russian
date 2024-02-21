import type { MessageRole } from "~/server/models/message.model";

export interface MessageFindResponse {
  id: string;
  threadId: string;
  text: string;
  role: MessageRole;
  createdAt: number;
}
