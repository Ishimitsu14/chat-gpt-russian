import { Collection } from "fireorm";
import { IsNotEmpty } from "class-validator";

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

@Collection()
export class Message {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  threadId: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  role: MessageRole;

  @IsNotEmpty()
  createdAt: number;
}
