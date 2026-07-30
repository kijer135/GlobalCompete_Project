import { prisma } from "./prisma";

export interface AchievementRule {
  id: string; // DB Achievement.id와 동일
  check: (userId: string) => Promise<boolean>;
}

export const achievementRules: AchievementRule[] = [
  {
    id: "first-test",
    check: async (userId) => (await prisma.testResult.count({ where: { userId } })) >= 1,
  },
  {
    id: "play-100",
    check: async (userId) => (await prisma.testResult.count({ where: { userId } })) >= 100,
  },
  // 새 업적: 여기에 객체 추가 + seed에 메타 추가
];

/** 결과 저장 후 호출. 새로 획득한 업적 id 목록을 반환한다. */
export async function evaluateAchievements(userId: string): Promise<string[]> {
  const owned = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true },
  });
  const ownedIds = new Set(owned.map((o) => o.achievementId));

  const unlocked: string[] = [];
  for (const rule of achievementRules.filter((r) => !ownedIds.has(r.id))) {
    if (await rule.check(userId)) {
      await prisma.userAchievement.create({ data: { userId, achievementId: rule.id } });
      unlocked.push(rule.id);
    }
  }
  return unlocked;
}
