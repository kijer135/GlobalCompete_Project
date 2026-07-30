import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, type AuthRequest } from "../../middleware/auth.js";

export const usersRouter = Router();

/** 내 프로필: 기록 요약 + 업적 */
usersRouter.get("/me/profile", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.auth!.userId;

  const [user, achievements, recentResults, totalPlays] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true, imageUrl: true, role: true, createdAt: true, loginStreak: true },
    }),
    prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    }),
    prisma.testResult.findMany({
      where: { userId },
      include: { test: { select: { name: true, unit: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.testResult.count({ where: { userId } }),
  ]);

  res.json({ user, achievements, recentResults, totalPlays });
});

const nicknameSchema = z.object({ nickname: z.string().min(2).max(16) });

usersRouter.patch("/me/nickname", requireAuth, async (req: AuthRequest, res) => {
  const parsed = nicknameSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "닉네임은 2~16자여야 합니다." });
  try {
    const user = await prisma.user.update({
      where: { id: req.auth!.userId },
      data: { nickname: parsed.data.nickname },
      select: { id: true, nickname: true },
    });
    res.json({ user });
  } catch {
    res.status(409).json({ error: "이미 사용 중인 닉네임입니다." });
  }
});

const imageSchema = z.object({ imageUrl: z.string().url().max(500) });

usersRouter.patch("/me/image", requireAuth, async (req: AuthRequest, res) => {
  const parsed = imageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "올바른 이미지 URL이 아닙니다." });
  const user = await prisma.user.update({
    where: { id: req.auth!.userId },
    data: { imageUrl: parsed.data.imageUrl },
    select: { id: true, imageUrl: true },
  });
  res.json({ user });
});
