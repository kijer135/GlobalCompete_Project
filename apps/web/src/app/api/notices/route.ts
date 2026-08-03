import { NextResponse } from "next/server";
import { prisma } from "@/server/prisma";

export async function GET() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json({ notices });
}
