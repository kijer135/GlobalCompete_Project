import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getAuth, unauthorized } from "@/server/auth";

export async function GET() {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  const userId = auth.userId;

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

  return NextResponse.json({ user, achievements, recentResults, totalPlays });
}
