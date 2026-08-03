const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const tests = [
    { id: "reaction-time", name: "반응속도", description: "화면이 초록색이 되면 최대한 빨리 클릭하세요. 5회 평균을 측정합니다.", unit: "ms", scoreDirection: "LOWER_IS_BETTER", sortOrder: 1 },
    { id: "cps", name: "클릭 속도", description: "10초 동안 최대한 많이 클릭하세요.", unit: "cps", scoreDirection: "HIGHER_IS_BETTER", sortOrder: 2 },
  ];
  for (const t of tests) {
    await prisma.test.upsert({ where: { id: t.id }, update: t, create: t });
  }

  const achievements = [
    { id: "first-test", name: "첫 걸음", description: "첫 테스트를 완료했습니다.", icon: "🎯" },
    { id: "play-100", name: "백전노장", description: "테스트를 100회 플레이했습니다.", icon: "💯" },
    { id: "top-10-percent", name: "엘리트", description: "어떤 테스트에서 상위 10%에 들었습니다.", icon: "🏆" },
  ];
  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { id: a.id }, update: a, create: a });
  }

  console.log("Seed completed.");
}

main().finally(() => prisma.$disconnect());
