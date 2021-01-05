import { Migration } from "@mikro-orm/migrations";

import { LOCAL, BLOCK, CONDOMINIUM } from "../../utils/constants";
import { defaults } from "../defaults";

export class Migration20201202033559 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(LOCAL, (t) => {
          defaults(k, t);
          t.string("name").notNullable();
          t.string("description").nullable();
          t.integer("capacity").notNullable();
          t.string("image").nullable();
          t.string("block").references("id").inTable(BLOCK).notNullable();
          t.string("condominium").references("id").inTable(CONDOMINIUM).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(LOCAL).toQuery());
  }
}
