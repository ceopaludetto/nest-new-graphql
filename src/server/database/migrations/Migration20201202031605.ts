import { Migration } from "@mikro-orm/migrations";

import { PERSON } from "../../utils/constants";
import { Gender } from "../../utils/enums";
import { defaults } from "../defaults";

export class Migration20201202031605 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(PERSON, (t) => {
          defaults(k, t);
          t.string("name").notNullable();
          t.string("lastName").notNullable();
          t.string("email").notNullable();
          t.string("cpf", 11).notNullable();
          t.date("birthdate").notNullable();
          t.enum("gender", [Gender.F, Gender.M, Gender.N]).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(PERSON).toQuery());
  }
}
