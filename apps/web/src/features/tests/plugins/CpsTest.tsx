"use client";

import { useEffect, useRef, useState } from "react";
import type { TestPlayProps } from "../types";

const DURATION_S = 10;

export function CpsTest({ onFinish }: TestPlayProps) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_S);
  const [running, setRunning] = useState(false);
  const clicksRef = useRef(0);
  const finishedRef = useRef(false);

  // 1초마다 카운트다운 (상태 계산만 — 순수)
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  // 종료 감지는 별도 effect에서 — 렌더링 밖에서 onFinish 호출
  useEffect(() => {
    if (running && timeLeft === 0 && !finishedRef.current) {
      finishedRef.current = true;
      const cps = Math.round((clicksRef.current / DURATION_S) * 100) / 100;
      onFinish(cps);
    }
  }, [running, timeLeft, onFinish]);

  function handleClick() {
    if (!running) {
      setRunning(true);
      return;
    }
    if (timeLeft === 0) return;
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  }

  return (
    <button
      onClick={handleClick}
      className="flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-blue-500 text-white select-none"
    >
      <span className="text-5xl font-bold">
        {running ? clicks : "클릭해서 시작"}
      </span>
      {running && <span className="mt-4 text-xl">남은 시간: {timeLeft}초</span>}
    </button>
  );
}
