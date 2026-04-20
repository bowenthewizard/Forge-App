"use client";

import { useEffect } from "react";
import { Check, CheckCheck, ArrowLeftRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import clsx from "clsx";

function parsePrev(prev: string): { weight: string; reps: string } {
  if (!prev) return { weight: "", reps: "" };
  const parts = prev.split("×").map((p) => p.trim());
  if (parts.length !== 2) return { weight: "", reps: "" };
  const weight = parts[0].replace(/[^0-9.]/g, "");
  const reps = parts[1].replace(/[^0-9]/g, "");
  return { weight, reps };
}

export function WorkoutScreen() {
  const exercises = useStore((s) => s.exercises);
  const workoutName = useStore((s) => s.workoutName);
  const workoutElapsed = useStore((s) => s.workoutElapsed);
  const workoutStartedAt = useStore((s) => s.workoutStartedAt);
  const tickWorkout = useStore((s) => s.tickWorkout);
  const startWorkout = useStore((s) => s.startWorkout);
  const finishWorkout = useStore((s) => s.finishWorkout);
  const toggleSet = useStore((s) => s.toggleSet);
  const updateSet = useStore((s) => s.updateSet);
  const addSet = useStore((s) => s.addSet);
  const completeAllSets = useStore((s) => s.completeAllSets);

  const totalPlannedSets = exercises.reduce((total, ex) => total + ex.sets.length, 0);
  const totalCompletedSets = exercises.reduce(
    (total, ex) => total + ex.sets.filter((set) => set.done).length,
    0
  );
  const progressPercent =
    totalPlannedSets > 0 ? (totalCompletedSets / totalPlannedSets) * 100 : 0;
  const firstIncompleteExerciseIdx = exercises.findIndex((ex) =>
    ex.sets.some((set) => !set.done)
  );
  const exercisePosition =
    firstIncompleteExerciseIdx === -1
      ? exercises.length
      : firstIncompleteExerciseIdx + 1;

  // Kick off workout timer when landing here fresh
  useEffect(() => {
    if (!workoutStartedAt) startWorkout();
  }, [workoutStartedAt, startWorkout]);

  // Tick the workout timer
  useEffect(() => {
    const interval = setInterval(tickWorkout, 1000);
    return () => clearInterval(interval);
  }, [tickWorkout]);

  return (
    <div className="pb-28 animate-fade-in">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-bg px-5 pt-2 pb-3.5 border-b border-separator">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">{workoutName}</div>
          {/* THE purple element for this screen */}
          <button
            onClick={finishWorkout}
            className="bg-purple hover:bg-purple-pressed transition-colors rounded-button text-[13px] font-semibold px-[18px] py-2.5"
          >
            Finish
          </button>
        </div>
        <div className="text-xs text-text-tertiary mt-0.5 tabular-nums">
          {formatDuration(workoutElapsed)}
        </div>
        <div className="mt-3 h-[2px] w-full bg-[#1F1F1F] rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
        <div className="mt-2 text-[11px] font-medium text-[#6B7280] uppercase tracking-[0.1em]">
          Exercise {exercisePosition} of {exercises.length}
        </div>
      </div>

      {/* Exercise list */}
      <div className="pt-3">
        {exercises.map((ex, ei) => (
          <div
            key={ex.id}
            className="mx-5 mb-3 rounded-[14px] bg-[#1A1A1A] p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-base font-semibold">{ex.name}</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {ex.muscleGroups.map((group) => (
                    <span
                      key={group}
                      className="bg-white/[0.06] rounded-[10px] px-[10px] py-[3px] text-[10px] font-medium text-[#9CA3AF]"
                    >
                      {group}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-[#6B7280] mt-1">
                  {ex.equipment}
                </div>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-semibold text-text-tertiary hover:text-text-secondary transition-colors">
                <ArrowLeftRight size={12} />
                Sub
              </button>
            </div>

            {/* Column headers */}
            <div className="flex items-center gap-2 pb-2">
              <div className="w-6 text-center text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                Set
              </div>
              <div className="flex-1 text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                Previous
              </div>
              <div className="w-[62px] text-center text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                Lbs
              </div>
              <div className="w-[62px] text-center text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">
                Reps
              </div>
              <div className="w-[34px]" />
            </div>

            {/* Sets */}
            {ex.sets.map((s, si) => {
              const suggested = parsePrev(s.prev);
              const prevDisplay = s.done
                ? `${s.weight || s.prev.split("×")[0].trim()} × ${s.reps || s.prev.split("×")[1]?.trim()}`
                : s.prev;

              return (
                <div
                  key={si}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg transition-all",
                    s.done
                      ? "bg-success/[0.06] -mx-2 px-2 py-3 my-0.5"
                      : "py-3"
                  )}
                >
                  <div
                    className={clsx(
                      "w-6 text-center text-[13px] font-medium flex-shrink-0",
                      s.done ? "text-success" : "text-text-tertiary"
                    )}
                  >
                    {s.n}
                  </div>
                  <div className="flex-1 text-xs text-text-tertiary truncate">
                    {prevDisplay}
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder={suggested.weight}
                    value={s.weight}
                    disabled={s.done}
                    onChange={(e) => updateSet(ei, si, "weight", e.target.value)}
                    className={clsx(
                      "w-[62px] bg-surface2 hover:bg-[#2A2A2A] transition-colors rounded-md py-2 text-center text-[15px] font-bold outline-none",
                      s.done && "opacity-50"
                    )}
                  />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={suggested.reps}
                    value={s.reps}
                    disabled={s.done}
                    onChange={(e) => updateSet(ei, si, "reps", e.target.value)}
                    className={clsx(
                      "w-[62px] bg-surface2 hover:bg-[#2A2A2A] transition-colors rounded-md py-2 text-center text-[15px] font-bold outline-none",
                      s.done && "opacity-50"
                    )}
                  />
                  <button
                    onClick={() => toggleSet(ei, si)}
                    aria-label={s.done ? "Mark set incomplete" : "Mark set complete"}
                    className={clsx(
                      "w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 transition-all border-[1.5px]",
                      s.done
                        ? "bg-success border-success"
                        : "bg-transparent border-text-tertiary hover:border-text-secondary"
                    )}
                  >
                    {s.done && <Check size={14} strokeWidth={3} color="white" />}
                  </button>
                </div>
              );
            })}

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => addSet(ei)}
                className="flex-1 h-8 border border-dashed border-white/[0.1] rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary hover:border-white/20 transition-colors"
              >
                + Add Set
              </button>
              <button
                onClick={() => completeAllSets(ei)}
                className="flex-1 h-8 rounded-lg border border-[#10B981]/[0.25] bg-[#10B981]/[0.12] text-[#10B981] text-sm font-medium flex items-center justify-center gap-1.5"
              >
                <CheckCheck size={14} />
                Complete All
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom finish button */}
      <div className="px-5 pt-4">
        <button
          onClick={finishWorkout}
          className="w-full h-12 border border-white/[0.12] rounded-button text-sm font-semibold text-text-secondary hover:bg-white/[0.03] transition-colors"
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
}
