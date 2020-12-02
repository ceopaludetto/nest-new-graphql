import { Migration } from "@mikro-orm/migrations";

import { CITY, STATE } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202033356 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(CITY, (t) => {
          defaults(k, t);
          t.string("name").notNullable();
          t.integer("code").notNullable().unique();
          t.string("state").references("id").inTable(STATE).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(CITY).toQuery());
  }
}
