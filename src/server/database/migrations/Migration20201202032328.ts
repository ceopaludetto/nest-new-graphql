import { Migration } from "@mikro-orm/migrations";

import { STATE } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202032328 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(STATE, (t) => {
          defaults(k, t);
          t.string("name").notNullable();
          t.string("initials").notNullable().unique();
          t.integer("code").notNullable().unique();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(STATE).toQuery());
  }
}
