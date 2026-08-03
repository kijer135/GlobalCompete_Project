import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";
import { getAuth, forbidden, unauthorized } from "@/server/auth";

export async function GET() {
  const auth = await getAuth();
  if (!auth) return unauthorized();
  if (auth.role !== "ADMIN") return forbidden();

  const users = await prisma.user.findMany({
    select: { id: true, email: true, nickname: true, role: true, createdAt: true, lastLoginAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}
