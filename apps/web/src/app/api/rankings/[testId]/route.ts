import { NextResponse } from "next/server";
import { getTestRanking, PERIODS, type Period } from "@/server/rankings";

export async function GET(req: Request, { params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const period = (new URL(req.url).searchParams.get("period") ?? "all") as Period;
  if (!PERIODS.includes(period)) {
    return NextResponse.json({ error: "잘못된 기간입니다." }, { status: 400 });
  }
  const entries = await getTestRanking(testId, period);
  return NextResponse.json({ entries });
}
