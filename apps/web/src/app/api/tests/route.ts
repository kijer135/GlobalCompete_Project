import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET() {
  const tests = await prisma.test.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ tests });
}
