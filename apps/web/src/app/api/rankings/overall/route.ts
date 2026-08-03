import { NextResponse } from "next/server";
import { getOverallRanking } from "@/server/rankings";

export async function GET() {
  const entries = await getOverallRanking();
  return NextResponse.json({ entries });
}
