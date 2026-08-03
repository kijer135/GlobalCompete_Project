import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getAuth, forbidden, unauthorized } from "@/server/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const { id } = await params;
  await prisma.notice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
