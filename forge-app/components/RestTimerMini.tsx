"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export function RestTimerMini() {
  const restActive = useStore((s) => s.restActive);
  const restSeconds = useStore((s) => s.restSeconds);
  const restMax = useStore((s) => s.restMax);
  const restExercise = useStore((s) => s.restExercise);
  const tickRest = useStore((s) => s.tickRest);
  const skipRest = useStore((s) => s.skipRest);

  useEffect(() => {
    if (!restActive) return;
    const interval = setInterval(tickRest, 1000);
    return () => clearInterval(interval);
  }, [restActive, tickRest]);

  if (!restActive) return null;

  const m = Math.floor(restSeconds / 60);
  const s = restSeconds % 60;
  const timeLabel = `${m}:${String(s).padStart(2, "0")}`;

  // Progress ring math
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - restSeconds / restMax);

  return (
    <div
      className="flex-shrink-0 flex items-center gap-3 px-5 py-2.5 border-t border-white/[0.07] animate-fade-in"
      style={{
        backgroundColor: "rgba(22, 22, 22, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden>
        <circle cx="17" cy="17" r={radius} fill="none" stroke="#2D2D2D" strokeWidth="2.5" />
        <circle
          cx="17"
          cy="17"
          r={radius}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "17px 17px",
            transition: "stroke-dashoffset 0.4s linear",
          }}
        />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-bold leading-none">{timeLabel}</div>
        <div className="text-[11px] text-text-secondary mt-1 truncate">
          Rest · {restExercise}
        </div>
      </div>
      <button
        onClick={skipRest}
        className="text-[11px] font-semibold text-text-secondary border border-white/[0.14] rounded-md px-3 py-1.5 hover:bg-white/[0.04] transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
