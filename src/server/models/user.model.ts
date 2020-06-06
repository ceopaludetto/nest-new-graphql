import { ObjectType, Field } from "@nestjs/graphql";
// import { hash, compare } from "bcryptjs";
// import { Table, Column, BeforeSave, ForeignKey, BelongsTo, DefaultScope } from "sequelize-typescript";

// import { USER } from "@/server/utils/constants";

import { BaseModel } from "./base.model";
import { Person } from "./person.model";

@ObjectType()
// @DefaultScope({ include: [() => Person] })
// @Table({ tableName: USER, modelName: USER })
export class User extends BaseModel {
  @Field()
  // @Column({ unique: true })
  public login!: string;

  @Field()
  // @Column
  public password!: string;

  @Field()
  // @ForeignKey(() => Person)
  // @Column
  public personID!: string;

  @Field(() => Person)
  // @BelongsTo(() => Person, {
  // foreignKey: "personID",
  // })
  public person!: Person;

  // public async comparePasswords(password: string) {
  //   return compare(password, this.password);
  // }

  // @BeforeSave
  // public static async hashPassword(instance: User) {
  //   if (instance.changed("password")) {
  //     instance.password = await hash(instance.password, 10);
  //   }
  // }
}
