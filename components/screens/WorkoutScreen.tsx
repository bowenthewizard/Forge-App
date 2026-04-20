"use client";

import { useEffect } from "react";
import { Check, ArrowLeftRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDuration } from "@/lib/utils";
import clsx from "clsx";

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
      <div className="sticky top-0 z-10 bg-bg px-5 pt-2 pb-3.5 flex justify-between items-center border-b border-separator">
        <div>
          <div className="text-xl font-bold">{workoutName}</div>
          <div className="text-xs text-text-tertiary mt-0.5 tabular-nums">
            {formatDuration(workoutElapsed)}
          </div>
        </div>
        {/* THE purple element for this screen */}
        <button
          onClick={finishWorkout}
          className="bg-purple hover:bg-purple-pressed transition-colors rounded-button text-[13px] font-semibold px-[18px] py-2.5"
        >
          Finish
        </button>
      </div>

      {/* Exercise list */}
      {exercises.map((ex, ei) => (
        <div
          key={ex.id}
          className="px-5 py-4 border-b border-separator"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <div className="text-base font-semibold">{ex.name}</div>
              <div className="text-[11px] text-text-tertiary mt-0.5">
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
            const prevDisplay = s.done
              ? `${s.weight || s.prev.split("×")[0].trim()} × ${s.reps || s.prev.split("×")[1]?.trim()}`
              : s.prev;

            return (
              <div
                key={si}
                className={clsx(
                  "flex items-center gap-2 rounded-lg transition-all",
                  s.done
                    ? "bg-success/[0.06] -mx-2 px-2 py-[7px] my-0.5"
                    : "py-[7px]"
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
                  placeholder="—"
                  value={s.weight}
                  disabled={s.done}
                  onChange={(e) => updateSet(ei, si, "weight", e.target.value)}
                  className={clsx(
                    "w-[62px] bg-surface2 rounded-md py-2 text-center text-[15px] font-bold outline-none",
                    s.done && "opacity-50"
                  )}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="—"
                  value={s.reps}
                  disabled={s.done}
                  onChange={(e) => updateSet(ei, si, "reps", e.target.value)}
                  className={clsx(
                    "w-[62px] bg-surface2 rounded-md py-2 text-center text-[15px] font-bold outline-none",
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

          <button
            onClick={() => addSet(ei)}
            className="w-full h-8 border border-dashed border-white/[0.1] rounded-md mt-2.5 text-xs font-medium text-text-tertiary hover:text-text-secondary hover:border-white/20 transition-colors"
          >
            + Add Set
          </button>
        </div>
      ))}

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
