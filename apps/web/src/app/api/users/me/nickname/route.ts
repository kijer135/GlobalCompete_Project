import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { getAuth, unauthorized } from "@/server/auth";

const nicknameSchema = z.object({ nickname: z.string().min(2).max(16) });

export async function PATCH(req: Request) {
  const auth = await getAuth();
  if (!auth) return unauthorized();

  const parsed = nicknameSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "닉네임은 2~16자여야 합니다." }, { status: 400 });
  }
  try {
    const user = await prisma.user.update({
      where: { id: auth.userId },
      data: { nickname: parsed.data.nickname },
      select: { id: true, nickname: true },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "이미 사용 중인 닉네임입니다." }, { status: 409 });
  }
}
