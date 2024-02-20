import { BaseModel, Field, ManyToOne, OneToMany } from "~/server/models/base.model";
import { MessageModel } from "~/server/models/message.model";
import { UserModel } from "~/server/models/user.model";

export interface IThread {
  id: string;
  name: string;
  userId: string; // Идентификатор пользователя из модели User
}

export class ThreadModel extends BaseModel {
  @Field("string", true)
  id: string;

  @Field("string")
  name: string;

  @Field("string")
  userId: string;

  // @ts-ignore
  @ManyToOne(() => UserModel, "userId")
  user: UserModel;

  // @ts-ignore
  @OneToMany(() => MessageModel, "threadId")
  messages: MessageModel[];

  constructor() {
    super();
    this.collectionName = "threads";
  }

  async createThread(thread: IThread): Promise<IThread> {
    try {
      return await this.addDocument<IThread>(thread);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}
