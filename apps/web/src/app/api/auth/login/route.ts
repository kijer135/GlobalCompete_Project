import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { signToken } from "@/server/jwt";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/server/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "이메일 또는 비밀번호가 틀렸습니다." }, { status: 401 });
  }

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

  const token = signToken({ userId: user.id, role: user.role });
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, nickname: user.nickname, role: user.role },
  });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res;
}
