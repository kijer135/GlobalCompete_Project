import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { getAuth, unauthorized } from "@/server/auth";

const imageSchema = z.object({ imageUrl: z.string().url().max(500) });

export async function PATCH(req: Request) {
  const auth = await getAuth();
  if (!auth) return unauthorized();

  const parsed = imageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "올바른 이미지 URL이 아닙니다." }, { status: 400 });
  }
  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { imageUrl: parsed.data.imageUrl },
    select: { id: true, imageUrl: true },
  });
  return NextResponse.json({ user });
}
