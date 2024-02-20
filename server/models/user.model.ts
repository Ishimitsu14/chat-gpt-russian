import { BaseModel, Field, OneToMany } from "~/server/models/base.model";
import { ThreadModel } from "~/server/models/tread.model";

export interface IUser {
  externalId: string;
  provider: string;
  name: string;
  email: string;
  avatar_url: string;
}

export class UserModel extends BaseModel {
  @Field("string", true)
  externalId: string;

  @Field("string")
  email: string;

  @Field("string")
  provider: string;

  @Field("string")
  name: string;

  // @ts-ignore
  @OneToMany(() => ThreadModel, "userId")
  threads: ThreadModel[];

  constructor() {
    super();
    this.collectionName = "users";
  }

  async createUser(user: IUser): Promise<IUser> {
    try {
      return await this.addDocument<IUser>(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<Record<string, any> | null> {
    try {
      return await this.getDocumentById(userId);
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async updateUserById(userId: string, data: Partial<IUser>): Promise<void> {
    try {
      await this.updateDocumentById(userId, data);
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async deleteUserById(userId: string): Promise<void> {
    try {
      await this.deleteDocumentById(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}
