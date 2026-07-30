import { prisma } from "../../lib/prisma.js";
import { achievementRules } from "./achievement.rules.js";

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
