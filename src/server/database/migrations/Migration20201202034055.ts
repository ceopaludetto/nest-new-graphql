/* eslint-disable no-await-in-loop */
import { Migration } from "@mikro-orm/migrations";
import axios from "axios";
import { generate } from "shortid";

import { STATE, CITY } from "../../utils/constants";

export class Migration20201202034055 extends Migration {
  async up() {
    const k = this.getKnex();

    const states = await this.execute(k(STATE).select<{ code: number; id: string }[]>().toQuery());

    await Promise.all(
      states.map(async (s) => {
        const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${s.code}/municipios`;
        const inner = await axios.get<{ nome: string; id: number }[]>(url);

        await Promise.all(
          inner.data
            .sort((a, b) => a.nome.localeCompare(b.nome))
            .map((c) => {
              return this.execute(
                k(CITY)
                  .insert({
                    id: generate(),
                    state: s.id,
                    name: c.nome,
                    code: c.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })
                  .toQuery()
              );
            })
        );
      })
    );
  }

  async down() {
    const k = this.getKnex();

    this.execute(k(CITY).delete().toQuery());
  }
}
