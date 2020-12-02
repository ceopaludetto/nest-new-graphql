import { Migration } from "@mikro-orm/migrations";
import axios from "axios";
import { generate } from "shortid";

import { STATE } from "../../utils/constants";

export class Migration20201202033659 extends Migration {
  async up() {
    const k = this.getKnex();

    const res = await axios.get<{ sigla: string; nome: string; id: number }[]>(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
    );

    await Promise.all(
      res.data
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map((s) => {
          return this.execute(
            k(STATE)
              .insert({
                id: generate(),
                name: s.nome,
                initials: s.sigla,
                code: s.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              .toQuery()
          );
        })
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k(STATE).delete().toQuery());
  }
}
