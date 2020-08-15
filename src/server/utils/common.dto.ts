import type { FindOptions } from "@mikro-orm/core";
import { QueryOrder } from "@mikro-orm/core";
import { ArgsType, Field, ID, Int, registerEnumType } from "@nestjs/graphql";
import { IsString, IsObject, IsInt, IsNumber, IsOptional } from "class-validator";
import type { Request, Response } from "express";

import { IsShortID } from "./validations";

registerEnumType(QueryOrder, {
  name: "Order",
});

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
  public take?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  public skip?: number;
}

export type Sort<T, U extends keyof T> = Pick<{ [P in keyof T]?: QueryOrder }, U>;

export type ShowAllWithSort = ShowAll & { sort?: FindOptions<any>["orderBy"] };

export class ContextType {
  @IsObject()
  public req!: Request;

  @IsObject()
  public res!: Response;
}

export type Mapped<T> = FindOptions<T>["populate"];
