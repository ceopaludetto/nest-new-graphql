import { Migration } from "@mikro-orm/migrations";

import { USER, PERSON } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202032232 extends Migration {
  async up(): Promise<void> {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(USER, (t) => {
          defaults(k, t);
          t.string("login").notNullable().unique();
          t.string("password").notNullable();
          t.string("person").references("id").inTable(PERSON).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(USER).toQuery());
  }
}
