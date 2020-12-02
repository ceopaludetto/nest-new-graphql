import { InputType, Field, ID, Int } from "@nestjs/graphql";
import { GraphQLUpload } from "apollo-server-express";
import { IsString, IsNumber, IsOptional, IsInt } from "class-validator";

import type { FileUpload } from "@/server/utils/common.dto";
import { IsShortID } from "@/server/utils/validations";

@InputType()
export class BlockInsertInput {
  @IsString()
  @Field()
  public name!: string;

  @IsInt()
  @IsNumber()
  @Field(() => Int)
  public number!: number;

  @IsOptional()
  @Field(() => GraphQLUpload!, { nullable: true }) // eslint-disable-line @typescript-eslint/no-non-null-assertion
  public image?: Promise<FileUpload>;

  @IsShortID()
  @IsOptional()
  @Field(() => ID, { nullable: true })
  public condominium?: string;
}
