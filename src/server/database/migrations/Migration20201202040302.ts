import { Migration } from "@mikro-orm/migrations";

import { USER } from "../../utils/constants";

export class Migration20201202040302 extends Migration {
  async up() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .alterTable(USER, (t) => {
          t.string("recoverToken").nullable();
        })
        .toQuery()
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(
      k.schema
        .alterTable(USER, (t) => {
          t.dropColumn("recoverToken");
        })
        .toQuery()
    );
  }
}
