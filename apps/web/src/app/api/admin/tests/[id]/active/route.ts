import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { getAuth, forbidden, unauthorized } from "@/server/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const { id } = await params;
  const parsed = z.object({ isActive: z.boolean() }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  const test = await prisma.test.update({
    where: { id },
    data: { isActive: parsed.data.isActive },
  });
  return NextResponse.json({ test });
}
