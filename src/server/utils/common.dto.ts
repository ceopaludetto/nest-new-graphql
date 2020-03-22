import { ArgsType, Field, ID, Int } from "@nestjs/graphql";
import { IsString, IsObject, IsInt, IsNumber, IsOptional } from "class-validator";
import { Request, Response } from "express";

import { IsShortID } from "./validations";

@ArgsType()
export class FindByID {
  @IsString()
  @IsShortID()
  @Field(() => ID)
  public id!: string;
}

@ArgsType()
export class ShowAll {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Field(() => Int, { nullable: true })
  public first?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Field(() => Int, { nullable: true })
  public skip?: number;
}

export class ContextType {
  @IsObject()
  public req!: Request;

  @IsObject()
  public res!: Response;
}
