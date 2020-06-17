import { ObjectType, Field } from "@nestjs/graphql";
import { hash, compare } from "bcryptjs";
import { Table, Column, BeforeSave, ForeignKey, BelongsTo } from "sequelize-typescript";

import { Person } from "@/server/components/person";
import { BaseModel } from "@/server/utils/base.model";
import { USER } from "@/server/utils/constants";

@ObjectType(USER)
@Table({ tableName: USER, modelName: USER })
export class User extends BaseModel<User> {
  @Field()
  @Column({ unique: true, allowNull: false })
  public login!: string;

  @Column({ allowNull: false })
  public password!: string;

  @Field()
  @ForeignKey(() => Person)
  @Column({ allowNull: false })
  public personID!: string;

  @Field(() => Person)
  @BelongsTo(() => Person, {
    foreignKey: "personID",
  })
  public person!: Person;

  public async comparePasswords(password: string) {
    return compare(password, this.password);
  }

  @BeforeSave
  public static async hashPassword(instance: User) {
    if (instance.changed("password")) {
      instance.password = await hash(instance.password, 10);
    }
  }
}
