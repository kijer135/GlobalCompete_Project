import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/server/prisma";
import { getAuth, forbidden, unauthorized } from "@/server/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const { id } = await params;
  const parsed = z.object({ role: z.enum(["USER", "ADMIN"]) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "잘못된 역할입니다." }, { status: 400 });

  const user = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, role: true },
  });
  return NextResponse.json({ user });
}
