import { Migration } from "@mikro-orm/migrations";

import { BLOCK } from "../../utils/constants";

export class Migration20201202040435 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .alterTable(BLOCK, (t) => {
          t.string("image").nullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .alterTable(BLOCK, (t) => {
          t.dropColumn("image");
        })
        .toQuery()
    );
  }
}
