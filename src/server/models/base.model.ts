import { Field, ID, ObjectType } from "@nestjs/graphql";
// import { PrimaryKey, CreatedAt, UpdatedAt, DeletedAt, Column, Model, Default } from "sequelize-typescript";
// import { generate } from "shortid";

@ObjectType()
export abstract class BaseModel {
  // @Default(generate)
  // @PrimaryKey
  // @Column
  @Field(() => ID)
  public id!: string;

  // @CreatedAt
  @Field()
  public createdAt!: Date;

  // @UpdatedAt
  @Field()
  public updatedAt!: Date;

  // @DeletedAt
  @Field()
  public deletedAt!: Date;
}
