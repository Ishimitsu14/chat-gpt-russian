import { Collection } from "fireorm";
import { IsNotEmpty } from "class-validator";

@Collection()
export class Thread {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  title?: string;

  @IsNotEmpty()
  createdAt: number;
}
