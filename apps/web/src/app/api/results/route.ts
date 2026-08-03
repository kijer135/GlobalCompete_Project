import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { getAuth, unauthorized } from "@/server/auth";
import { evaluateAchievements } from "@/server/achievements";

const submitSchema = z.object({
  testId: z.string().min(1),
  score: z.number().finite(),
});

/** 테스트별 최소한의 어뷰징 방지용 유효 범위 */
const SCORE_BOUNDS: Record<string, { min: number; max: number }> = {
  "reaction-time": { min: 80, max: 60000 },
  cps: { min: 0, max: 25 },
};

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth) return unauthorized();

  const parsed = submitSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  const { testId, score } = parsed.data;
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test || !test.isActive) {
    return NextResponse.json({ error: "존재하지 않는 테스트입니다." }, { status: 404 });
  }

  const bounds = SCORE_BOUNDS[testId];
  if (bounds && (score < bounds.min || score > bounds.max)) {
    return NextResponse.json({ error: "유효하지 않은 점수입니다." }, { status: 422 });
  }

  const result = await prisma.testResult.create({
    data: { userId: auth.userId, testId, score },
  });

  const unlockedAchievements = await evaluateAchievements(auth.userId);
  return NextResponse.json({ result, unlockedAchievements }, { status: 201 });
}
