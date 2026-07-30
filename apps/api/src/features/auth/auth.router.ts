import { Router } from "express";
import { signupSchema, loginSchema } from "./auth.schema.js";
import * as authService from "./auth.service.js";
import { signToken } from "../../lib/jwt.js";
import { requireAuth, type AuthRequest } from "../../middleware/auth.js";
import { prisma } from "../../lib/prisma.js";

export const authRouter = Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: false, // 배포(HTTPS) 시 true
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

authRouter.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }
  const { email, password, nickname } = parsed.data;
  try {
    const user = await authService.signup(email, password, nickname);
    const token = signToken({ userId: user.id, role: user.role });
    res.cookie("token", token, COOKIE_OPTIONS).status(201).json({ user });
  } catch {
    res.status(409).json({ error: "이미 사용 중인 이메일 또는 닉네임입니다." });
  }
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "입력값이 올바르지 않습니다." });

  const user = await authService.login(parsed.data.email, parsed.data.password);
  if (!user) return res.status(401).json({ error: "이메일 또는 비밀번호가 틀렸습니다." });

  const token = signToken({ userId: user.id, role: user.role });
  res.cookie("token", token, COOKIE_OPTIONS).json({ user });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token").json({ ok: true });
});

authRouter.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.auth!.userId },
    select: { id: true, email: true, nickname: true, imageUrl: true, role: true },
  });
  res.json({ user });
});
