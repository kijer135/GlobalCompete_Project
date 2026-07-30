"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { testRegistry } from "@/features/tests/registry";

type Period = "daily" | "weekly" | "monthly" | "all";

interface Entry {
  rank: number;
  nickname: string;
  score: number;
}

const PERIOD_LABELS: Record<Period, string> = {
  daily: "일간", weekly: "주간", monthly: "월간", all: "전체",
};

export default function TestRankingPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params);
  const meta = testRegistry[testId];
  const [period, setPeriod] = useState<Period>("all");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    if (!meta) return;
    api<{ entries: Entry[] }>(`/rankings/${testId}?period=${period}`)
      .then((d) => setEntries(d.entries))
      .catch(() => setEntries([]));
  }, [testId, period, meta]);

  if (!meta) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">{meta.name} 랭킹</h1>

      <div className="flex gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`rounded-full px-4 py-1.5 text-sm ${
              period === p ? "bg-blue-600 text-white" : "border hover:bg-gray-50"
            }`}>
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-sm text-gray-500">
            <th className="py-2">순위</th><th>닉네임</th>
            <th className="text-right">기록 ({meta.unit})</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.rank} className="border-b">
              <td className="py-2 font-semibold">{e.rank}</td>
              <td>{e.nickname}</td>
              <td className="text-right font-mono">{e.score}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr><td colSpan={3} className="py-8 text-center text-gray-400">아직 기록이 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
