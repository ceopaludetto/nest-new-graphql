import { Migration } from "@mikro-orm/migrations";

import { ADDRESS, CITY, CONDOMINIUM } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202040216 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(ADDRESS, (t) => {
          defaults(k, t);
          t.string("zip", 8).notNullable();
          t.string("address").notNullable();
          t.string("number").notNullable();
          t.string("city").references("id").inTable(CITY).notNullable();
          t.string("condominium").references("id").inTable(CONDOMINIUM).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(ADDRESS).toQuery());
  }
}
