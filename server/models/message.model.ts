import { BaseModel, Field, ManyToOne } from "~/server/models/base.model";
import { ThreadModel } from "~/server/models/tread.model";

export interface IMessage {
  id: string;
  text: string;
  threadId: string;
}

export class MessageModel extends BaseModel {
  @Field("string", true)
  id: string;

  @Field("string")
  text: string;

  @Field("string")
  threadId: string;

  // @ts-ignore
  @ManyToOne(() => ThreadModel, "threadId")
  thread: ThreadModel;

  constructor() {
    super();
    this.collectionName = "messages";
  }
}
