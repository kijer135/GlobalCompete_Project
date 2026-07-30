import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma.js";

export async function signup(email: string, password: string, nickname: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, passwordHash, nickname },
    select: { id: true, email: true, nickname: true, role: true },
  });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  // 연속 로그인(streak) 갱신
  const now = new Date();
  const last = user.lastLoginAt;
  let streak = user.loginStreak;
  if (!last) streak = 1;
  else {
    const dayMs = 24 * 60 * 60 * 1000;
    const lastDay = Math.floor(last.getTime() / dayMs);
    const today = Math.floor(now.getTime() / dayMs);
    if (today === lastDay + 1) streak += 1;
    else if (today > lastDay + 1) streak = 1;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: now, loginStreak: streak },
  });
  return { id: user.id, email: user.email, nickname: user.nickname, role: user.role };
}
