"use client";

import { useRef, useState } from "react";
import type { TestPlayProps } from "../types";

const ROUNDS = 5;
type Phase = "waiting" | "ready" | "now" | "tooSoon";

export function ReactionTimeTest({ onFinish }: TestPlayProps) {
  const [phase, setPhase] = useState<Phase>("waiting");
  const [times, setTimes] = useState<number[]>([]);
  const startAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startRound() {
    setPhase("ready");
    timer.current = setTimeout(() => {
      startAt.current = performance.now();
      setPhase("now");
    }, 1000 + Math.random() * 2000);
  }

  function handleClick() {
    if (phase === "waiting" || phase === "tooSoon") return startRound();
    if (phase === "ready") {
      if (timer.current) clearTimeout(timer.current);
      return setPhase("tooSoon");
    }
    const elapsed = performance.now() - startAt.current;
    const next = [...times, elapsed];
    setTimes(next);
    if (next.length >= ROUNDS) {
      const avg = next.reduce((a, b) => a + b, 0) / next.length;
      onFinish(Math.round(avg));
    } else {
      startRound();
    }
  }

  const styles: Record<Phase, { bg: string; text: string }> = {
    waiting: { bg: "bg-blue-500", text: "클릭해서 시작" },
    ready: { bg: "bg-red-500", text: "초록색이 되면 클릭..." },
    now: { bg: "bg-green-500", text: "지금 클릭!" },
    tooSoon: { bg: "bg-yellow-500", text: "너무 빨랐어요! 클릭해서 재시도" },
  };

  return (
    <button
      onClick={handleClick}
      className={`flex h-96 w-full cursor-pointer items-center justify-center rounded-xl text-2xl font-bold text-white ${styles[phase].bg}`}
    >
      {styles[phase].text} ({times.length}/{ROUNDS})
    </button>
  );
}
