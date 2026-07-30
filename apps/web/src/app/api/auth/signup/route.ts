import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { signToken } from "@/server/jwt";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/server/auth";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다."),
  nickname: z.string().min(2).max(16),
});

export async function POST(req: Request) {
  const parsed = signupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { email, password, nickname } = parsed.data;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, nickname },
      select: { id: true, email: true, nickname: true, role: true },
    });
    const token = signToken({ userId: user.id, role: user.role });
    const res = NextResponse.json({ user }, { status: 201 });
    res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res;
  } catch {
    return NextResponse.json({ error: "이미 사용 중인 이메일 또는 닉네임입니다." }, { status: 409 });
  }
}
