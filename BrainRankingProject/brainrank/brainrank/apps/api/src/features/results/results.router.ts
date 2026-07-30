import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, type AuthRequest } from "../../middleware/auth.js";
import { evaluateAchievements } from "../achievements/achievements.service.js";

export const resultsRouter = Router();

const submitSchema = z.object({
  testId: z.string().min(1),
  score: z.number().finite(),
});

/** 테스트별 최소한의 어뷰징 방지용 유효 범위 */
const SCORE_BOUNDS: Record<string, { min: number; max: number }> = {
  "reaction-time": { min: 80, max: 60000 },
  cps: { min: 0, max: 25 },
};

resultsRouter.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = submitSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "잘못된 요청입니다." });

  const { testId, score } = parsed.data;
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test || !test.isActive) return res.status(404).json({ error: "존재하지 않는 테스트입니다." });

  const bounds = SCORE_BOUNDS[testId];
  if (bounds && (score < bounds.min || score > bounds.max)) {
    return res.status(422).json({ error: "유효하지 않은 점수입니다." });
  }

  const result = await prisma.testResult.create({
    data: { userId: req.auth!.userId, testId, score },
  });

  const unlockedAchievements = await evaluateAchievements(req.auth!.userId);
  res.status(201).json({ result, unlockedAchievements });
});
