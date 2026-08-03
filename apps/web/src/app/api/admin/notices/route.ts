import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { getAuth, forbidden, unauthorized } from "@/server/auth";

const noticeSchema = z.object({ title: z.string().min(1).max(100), content: z.string().min(1) });

export async function POST(req: Request) {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const parsed = noticeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "제목과 내용을 입력하세요." }, { status: 400 });

  const notice = await prisma.notice.create({ data: parsed.data });
  return NextResponse.json({ notice }, { status: 201 });
}
