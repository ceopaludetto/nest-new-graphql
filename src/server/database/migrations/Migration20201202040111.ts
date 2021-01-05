import { Migration } from "@mikro-orm/migrations";

import { PHONE, PERSON } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202040111 extends Migration {
  async up(): Promise<void> {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(PHONE, (t) => {
          defaults(k, t);
          t.string("ddd", 2).notNullable();
          t.string("number", 9).notNullable();
          t.string("person").references("id").inTable(PERSON).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(PHONE).toQuery());
  }
}
