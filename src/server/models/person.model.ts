import { ObjectType, Field, registerEnumType } from "@nestjs/graphql";
// import { Table, Column, DataType } from "sequelize-typescript";

// import { PERSON } from "@/server/utils/constants";

import { BaseModel } from "./base.model";

export enum Gender {
  M = "Male",
  F = "Female",
  N = "None",
}

registerEnumType(Gender, {
  name: "Gender",
});

@ObjectType()
// @Table({ tableName: PERSON, modelName: PERSON })
export class Person extends BaseModel {
  @Field()
  // @Column
  public name!: string;

  @Field()
  // @Column({ unique: true })
  public email!: string;

  @Field(() => Gender)
  // @Column(DataType.ENUM(Gender.N, Gender.M, Gender.F))
  public gender!: Gender;
}
