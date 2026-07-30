import jwt from "jsonwebtoken";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

export interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret()) as JwtPayload;
}
