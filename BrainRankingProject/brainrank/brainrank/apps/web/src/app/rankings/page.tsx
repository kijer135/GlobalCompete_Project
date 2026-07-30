"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { testRegistry } from "@/features/tests/registry";

interface Entry {
  rank: number;
  nickname: string;
  score: number;
}

export default function OverallRankingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    api<{ entries: Entry[] }>("/rankings/overall").then((d) => setEntries(d.entries)).catch(() => {});
  }, []);

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="text-3xl font-bold">전체 랭킹 (Overall Score)</h1>
      <p className="text-sm text-gray-500">각 테스트에서의 백분위 점수를 평균한 종합 점수입니다.</p>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-sm text-gray-500">
            <th className="py-2">순위</th><th>닉네임</th><th className="text-right">Overall</th>
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

      <section>
        <h2 className="mb-3 text-xl font-bold">테스트별 랭킹</h2>
        <div className="flex flex-wrap gap-2">
          {Object.values(testRegistry).map((t) => (
            <Link key={t.id} href={`/rankings/${t.id}`}
              className="rounded-full border px-4 py-1.5 text-sm hover:bg-gray-50">
              {t.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
