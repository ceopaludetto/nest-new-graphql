import { EntityRepository } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { UserInputError } from "apollo-server-express";

import { UploadService } from "@/server/components/upload";
import { Block } from "@/server/models";
import type { Mapped, ShowAll } from "@/server/utils/common.dto";

import type { BlockInsertInput } from "./block.dto";

@Injectable()
export class BlockService {
  public constructor(
    @InjectRepository(Block) private readonly blockModel: EntityRepository<Block>,
    private readonly uploadService: UploadService
  ) {}

  public async showAll(condominium: string, { skip = 0, take }: ShowAll, mapped?: Mapped<Block>) {
    return this.blockModel.find(
      {
        condominium,
      },
      {
        offset: skip,
        limit: take,
        populate: mapped,
      }
    );
  }

  public async findByID(id: string, mapped?: Mapped<Block>) {
    return this.blockModel.findOne({ id }, mapped);
  }

  public async create({ image, ...data }: BlockInsertInput, mapped?: Mapped<Block>) {
    const block = this.blockModel.create(data);

    if (image) {
      const path = await this.uploadService.upload(await image);

      block.image = path;
    }

    await this.flush(block);

    return this.populate(block, mapped);
  }

  public async flush(block: Block) {
    await this.blockModel.persistAndFlush(block);
  }

  public async populate(block: Block, fields?: Mapped<Block>) {
    if (!fields) {
      throw new UserInputError("Provide populate fields");
    }

    return this.blockModel.populate(block, fields);
  }
}
