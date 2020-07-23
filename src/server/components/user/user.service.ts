import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Queue } from "bull";

import { Person, User, Phone, Condominium, Address } from "@/server/models";
import type { ShowAll, Mapped } from "@/server/utils/common.dto";

import { UserInsertInput } from "./user.dto";

@Injectable()
export class UserService {
  public constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectQueue("mail") private readonly mailQueue: Queue
  ) {}

  public async showAll({ skip = 0, take }: ShowAll, mapped?: Mapped) {
    return this.userModel.findAll({
      offset: skip,
      limit: take,
      ...mapped,
    });
  }

  public async findByLogin(login: string, mapped?: Mapped) {
    return this.userModel.findOne({
      where: { login },
      ...mapped,
    });
  }

  public async findByID(id: string, mapped?: Mapped) {
    return this.userModel.findByPk(id, {
      attributes: mapped?.attributes,
      include: mapped?.include ?? [Person],
    });
  }

  public async findByPersonID(id: string, mapped?: Mapped) {
    return this.userModel.findOne({
      where: { personID: id },
      ...mapped,
    });
  }

  public async create(data: UserInsertInput) {
    const user = await this.userModel.create(data, {
      include: [
        {
          model: Person,
          include: [
            Phone,
            {
              model: Condominium,
              include: [Address],
            },
          ],
        },
      ],
    });

    await this.mailQueue.add("register", user, {
      removeOnFail: true,
      repeat: {
        every: 1000,
        limit: 5,
      },
    });

    return user;
  }
}
