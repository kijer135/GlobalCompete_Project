"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/features/auth/AuthProvider";
import { AdSlot } from "@/components/AdSlot";
import type { TestMeta } from "./types";

type Stage = "intro" | "playing" | "done";

interface SubmitResponse {
  result: { id: string; score: number };
  unlockedAchievements: string[];
}

export function TestShell({ meta }: { meta: TestMeta }) {
  const { user } = useAuth();
  const [stage, setStage] = useState<Stage>("intro");
  const [score, setScore] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  async function handleFinish(finalScore: number) {
    setScore(finalScore);
    setStage("done");
    if (!user) return;
    try {
      const d = await api<SubmitResponse>("/results", {
        method: "POST",
        body: JSON.stringify({ testId: meta.id, score: finalScore }),
      });
      setSaved(true);
      setUnlocked(d.unlockedAchievements);
    } catch {
      setSaved(false);
    }
  }

  function restart() {
    setScore(null);
    setUnlocked([]);
    setStage("playing");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">{meta.name}</h1>

      {stage === "intro" && (
        <div className="space-y-4">
          <p className="text-gray-600">{meta.description}</p>
          <button onClick={() => setStage("playing")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            시작하기
          </button>
        </div>
      )}

      {stage === "playing" && <meta.Component onFinish={handleFinish} />}

      {stage === "done" && score !== null && (
        <div className="space-y-4 text-center">
          <p className="text-5xl font-bold">
            {score} <span className="text-2xl text-gray-500">{meta.unit}</span>
          </p>
          {unlocked.length > 0 && (
            <p className="font-semibold text-amber-600">🎉 새로운 업적 달성!</p>
          )}
          <p className="text-sm text-gray-500">
            {user ? (saved ? "기록이 저장되었습니다." : "저장에 실패했습니다.") : "로그인하면 기록이 저장됩니다."}
          </p>
          <button onClick={restart}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            다시 하기
          </button>
          <AdSlot position="result-bottom" />
        </div>
      )}
    </div>
  );
}
