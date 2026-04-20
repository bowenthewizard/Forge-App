"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";

function formatDuration(durationSeconds: number) {
  if (durationSeconds >= 3600) {
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  if (durationSeconds >= 60) {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
  return `${durationSeconds}s`;
}

function formatDelta(delta: number) {
  const sign = delta > 0 ? "+" : delta < 0 ? "−" : "";
  return `${sign}${Math.abs(delta).toLocaleString()} lbs vs last time`;
}

export function PostWorkoutSummaryScreen() {
  const dismissSummary = useStore((s) => s.dismissSummary);
  const snapshot = useStore((s) => s.completedWorkout);
  const [copied, setCopied] = useState(false);

  const completedSetCount = useMemo(
    () => snapshot?.exercises.reduce((count, exercise) => count + exercise.sets.length, 0) ?? 0,
    [snapshot]
  );
  const completedExerciseCount = snapshot?.exercises.length ?? 0;

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  if (!snapshot) {
    return (
      <div className="min-h-full px-5 py-6 flex items-center justify-center">
        <button
          onClick={dismissSummary}
          className="h-12 px-5 rounded-button border border-white/[0.15] text-sm font-semibold text-white"
        >
          Return Home
        </button>
      </div>
    );
  }

  const shareText = `Just finished ${snapshot.name} — ${snapshot.totalVolume.toLocaleString()} lbs lifted. ${formatDuration(snapshot.durationSeconds)}. 🔨`;

  const shareWorkout = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-full px-5 pb-5 animate-fade-in flex flex-col">
      <div className="sticky top-0 z-10 bg-bg py-4">
        <div className="relative flex items-center justify-center">
          <div className="text-[11px] font-medium tracking-[0.12em] text-text-tertiary uppercase">
            Workout Complete
          </div>
          <button
            onClick={dismissSummary}
            className="absolute right-0 w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Close summary"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="text-center mt-1">
        <div className="text-base font-medium text-text-secondary">{snapshot.name}</div>
        <div className="mt-2 flex items-end justify-center gap-1.5">
          <div className="text-[56px] leading-none font-bold tabular-nums text-white">
            {snapshot.totalVolume.toLocaleString()}
          </div>
          <div className="text-[18px] font-medium text-text-tertiary pb-2">lbs</div>
        </div>
        {snapshot.volumeDeltaVsLastTime !== null && (
          <div
            className={`mt-1.5 text-[13px] ${
              snapshot.volumeDeltaVsLastTime > 0 ? "text-success" : "text-text-secondary"
            }`}
          >
            {formatDelta(snapshot.volumeDeltaVsLastTime)}
          </div>
        )}
      </div>

      <div className="border-y border-separator py-5 mt-8">
        <div className="grid grid-cols-3">
          <div className="text-center">
            <div className="text-[20px] font-bold text-white tabular-nums">
              {formatDuration(snapshot.durationSeconds)}
            </div>
            <div className="mt-0.5 text-[10px] font-medium tracking-[0.1em] text-text-tertiary uppercase">
              Duration
            </div>
          </div>
          <div className="text-center">
            <div className="text-[20px] font-bold text-white tabular-nums">{completedSetCount}</div>
            <div className="mt-0.5 text-[10px] font-medium tracking-[0.1em] text-text-tertiary uppercase">
              Sets
            </div>
          </div>
          <div className="text-center">
            <div className="text-[20px] font-bold text-white tabular-nums">{completedExerciseCount}</div>
            <div className="mt-0.5 text-[10px] font-medium tracking-[0.1em] text-text-tertiary uppercase">
              Exercises
            </div>
          </div>
        </div>
      </div>

      {snapshot.prs.length > 0 && (
        <div className="mt-6 bg-surface rounded-card border border-success/20 p-4">
          <div className="section-label text-success">New PR</div>
        </div>
      )}

      <div className="mt-6 pb-[100px]">
        <div className="section-label mb-3">Exercises</div>
        {snapshot.exercises.map((exercise) => {
          const bestSetIndex = exercise.sets.reduce((bestIndex, setItem, index, allSets) => {
            const currentScore = (parseFloat(setItem.weight) || 0) * (parseInt(setItem.reps, 10) || 0);
            const bestScore =
              (parseFloat(allSets[bestIndex]?.weight ?? "0") || 0) *
              (parseInt(allSets[bestIndex]?.reps ?? "0", 10) || 0);
            return currentScore > bestScore ? index : bestIndex;
          }, 0);

          return (
            <div key={exercise.name} className="bg-surface rounded-card p-4 mb-2.5">
              <div className="text-[15px] font-semibold text-white">{exercise.name}</div>
              <div className="text-[11px] text-text-tertiary mt-0.5">{exercise.equipment}</div>
              <div className="mt-2 text-[13px] text-text-secondary flex flex-wrap gap-x-2">
                {exercise.sets.map((setItem, index) => (
                  <span
                    key={`${exercise.name}-${setItem.n}`}
                    className={index === bestSetIndex ? "text-white font-semibold" : "text-text-secondary"}
                  >
                    {setItem.weight}×{setItem.reps}
                    {index < exercise.sets.length - 1 ? " ·" : ""}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-auto backdrop-blur-md bg-bg/70 border-t border-white/[0.08] py-3">
        <div className="flex gap-3">
          <button
            onClick={dismissSummary}
            className="h-12 flex-1 rounded-button border border-white/[0.15] text-sm font-semibold text-white"
          >
            Done
          </button>
          <button
            onClick={shareWorkout}
            className="h-12 flex-1 rounded-button bg-purple hover:bg-purple-pressed transition-colors text-sm font-semibold text-white"
          >
            Share
          </button>
        </div>
        {copied && <div className="text-center text-xs text-text-secondary mt-2">Copied!</div>}
      </div>
    </div>
  );
}
