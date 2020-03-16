import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";
import { JwtFromRequestFunction } from "passport-jwt";

export function extractor(req: Request): JwtFromRequestFunction {
  const { auth } = req.cookies;

  if (!auth) {
    throw new AuthenticationError("Token não encontrado");
  }

  const [bearer, token] = auth.split(" ");

  if (!/Bearer/.test(bearer)) {
    throw new AuthenticationError("Token mal-formatado");
  }

  return token;
}
