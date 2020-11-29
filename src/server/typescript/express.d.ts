import "express";

import type { User } from "@/server/models";

declare module "express" {
  interface Request {
    user: User;
    condominium: string;
  }
}
