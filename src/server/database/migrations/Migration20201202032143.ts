import { Migration } from "@mikro-orm/migrations";

import { PERSON_CONDOMINIUM, PERSON, CONDOMINIUM } from "../../utils/constants";

export class Migration20201202032143 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .createTable(PERSON_CONDOMINIUM, (t) => {
          t.string("person").references("id").inTable(PERSON).notNullable();
          t.string("condominium").references("id").inTable(CONDOMINIUM).notNullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k.schema.dropTable(PERSON_CONDOMINIUM).toQuery());
  }
}
