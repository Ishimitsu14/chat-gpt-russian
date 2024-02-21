import { Collection } from "fireorm";
import { IsEmail } from "class-validator";

@Collection()
export class User {
  id: string;

  externalId: string;

  avatar_url: string;

  @IsEmail()
  email: string;

  name: string;

  provider: string;
}
