import { Entity, Property, OneToOne } from "@mikro-orm/core";
import { ObjectType, Field } from "@nestjs/graphql";
import { compare } from "bcryptjs";

import { USER } from "@/server/utils/constants";

import { BaseModel } from "./base.model";
import { Person } from "./person.model";

@ObjectType(USER)
@Entity({ tableName: USER })
export class User extends BaseModel {
  @Field()
  @Property({ unique: true })
  public login!: string;

  @Property({ hidden: true })
  public password!: string;

  @Property({ hidden: true })
  public recoverToken!: string;

  @Field(() => Person)
  @OneToOne({ entity: () => Person, inversedBy: (person) => person.user })
  public person!: Person;

  public async comparePasswords(password: string) {
    return compare(password, this.password);
  }
}
