import { prisma } from "../../lib/prisma.js";

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
