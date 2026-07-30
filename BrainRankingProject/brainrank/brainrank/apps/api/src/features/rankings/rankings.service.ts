import { prisma } from "../../lib/prisma.js";

export type Period = "daily" | "weekly" | "monthly" | "all";

export function periodStart(period: Period): Date | undefined {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  switch (period) {
    case "daily": return new Date(now - day);
    case "weekly": return new Date(now - 7 * day);
    case "monthly": return new Date(now - 30 * day);
    case "all": return undefined;
  }
}

export interface RankingEntry {
  rank: number;
  userId: string;
  nickname: string;
  score: number;
}

/** 유저별 베스트 기록만 뽑아 정렬한 랭킹 */
export async function getTestRanking(
  testId: string,
  period: Period,
  limit = 50,
): Promise<RankingEntry[]> {
  const test = await prisma.test.findUnique({ where: { id: testId } });
  if (!test) return [];

  const since = periodStart(period);
  const lowerIsBetter = test.scoreDirection === "LOWER_IS_BETTER";

  const grouped = await prisma.testResult.groupBy({
    by: ["userId"],
    where: { testId, ...(since ? { createdAt: { gte: since } } : {}) },
    _min: { score: true },
    _max: { score: true },
  });

  const bests = grouped
    .map((g) => ({
      userId: g.userId,
      score: (lowerIsBetter ? g._min.score : g._max.score) ?? 0,
    }))
    .sort((a, b) => (lowerIsBetter ? a.score - b.score : b.score - a.score))
    .slice(0, limit);

  const users = await prisma.user.findMany({
    where: { id: { in: bests.map((b) => b.userId) } },
    select: { id: true, nickname: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.nickname]));

  return bests.map((b, i) => ({
    rank: i + 1,
    userId: b.userId,
    nickname: nameById.get(b.userId) ?? "탈퇴한 사용자",
    score: b.score,
  }));
}

/**
 * Overall Score: 각 테스트에서 유저의 백분위(0~100)를 구해 평균.
 * 참여한 테스트가 많을수록 표본이 넓어진다. (최소 1개 테스트 참여 필요)
 */
export async function getOverallRanking(limit = 50): Promise<RankingEntry[]> {
  const tests = await prisma.test.findMany({ where: { isActive: true } });
  const percentilesByUser = new Map<string, number[]>();

  for (const test of tests) {
    const lowerIsBetter = test.scoreDirection === "LOWER_IS_BETTER";
    const grouped = await prisma.testResult.groupBy({
      by: ["userId"],
      where: { testId: test.id },
      _min: { score: true },
      _max: { score: true },
    });
    const bests = grouped
      .map((g) => ({
        userId: g.userId,
        score: (lowerIsBetter ? g._min.score : g._max.score) ?? 0,
      }))
      .sort((a, b) => (lowerIsBetter ? a.score - b.score : b.score - a.score));

    const n = bests.length;
    bests.forEach((b, i) => {
      // 1등 = 100, 꼴등 = 0에 가깝게
      const percentile = n === 1 ? 100 : ((n - 1 - i) / (n - 1)) * 100;
      const list = percentilesByUser.get(b.userId) ?? [];
      list.push(percentile);
      percentilesByUser.set(b.userId, list);
    });
  }

  const overall = [...percentilesByUser.entries()]
    .map(([userId, ps]) => ({
      userId,
      score: Math.round((ps.reduce((a, b) => a + b, 0) / ps.length) * 10) / 10,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  const users = await prisma.user.findMany({
    where: { id: { in: overall.map((o) => o.userId) } },
    select: { id: true, nickname: true },
  });
  const nameById = new Map(users.map((u) => [u.id, u.nickname]));

  return overall.map((o, i) => ({
    rank: i + 1,
    userId: o.userId,
    nickname: nameById.get(o.userId) ?? "탈퇴한 사용자",
    score: o.score,
  }));
}
