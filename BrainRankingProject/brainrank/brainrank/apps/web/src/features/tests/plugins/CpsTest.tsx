"use client";

import { useEffect, useRef, useState } from "react";
import type { TestPlayProps } from "../types";

const DURATION_S = 10;

export function CpsTest({ onFinish }: TestPlayProps) {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION_S);
  const [running, setRunning] = useState(false);
  const clicksRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          const cps = Math.round((clicksRef.current / DURATION_S) * 100) / 100;
          onFinish(cps);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, onFinish]);

  function handleClick() {
    if (!running) {
      setRunning(true);
      return;
    }
    clicksRef.current += 1;
    setClicks(clicksRef.current);
  }

  return (
    <button
      onClick={handleClick}
      className="flex h-96 w-full cursor-pointer flex-col items-center justify-center rounded-xl bg-blue-500 text-white select-none"
    >
      <span className="text-5xl font-bold">{running ? clicks : "클릭해서 시작"}</span>
      {running && <span className="mt-4 text-xl">남은 시간: {timeLeft}초</span>}
    </button>
  );
}
