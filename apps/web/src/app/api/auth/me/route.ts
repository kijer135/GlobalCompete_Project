import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getAuth, unauthorized } from "@/server/auth";

export async function GET() {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, nickname: true, imageUrl: true, role: true },
  });
  return NextResponse.json({ user });
}
