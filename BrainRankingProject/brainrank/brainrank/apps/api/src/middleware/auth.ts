import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../lib/jwt.js";

export interface AuthRequest extends Request {
  auth?: JwtPayload;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token as string | undefined;
  if (!token) return res.status(401).json({ error: "로그인이 필요합니다." });
  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: "세션이 만료되었습니다." });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.auth?.role !== "ADMIN") return res.status(403).json({ error: "권한이 없습니다." });
    next();
  });
}
