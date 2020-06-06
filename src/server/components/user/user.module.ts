import { Module } from "@nestjs/common";
// import { SequelizeModule } from "@nestjs/sequelize";

// import { User } from "@/server/models";

import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  // imports: [SequelizeModule.forFeature([User])],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
