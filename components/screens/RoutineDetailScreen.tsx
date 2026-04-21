"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Dumbbell, MoreHorizontal, PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { EXERCISES } from "@/lib/data/exercises";
import { useLastPRs } from "@/lib/hooks/useLastPRs";

type RoutineExercise = {
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  order: number;
  notes?: string;
};

type Routine = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string;
  estimated_duration_minutes: number | null;
  exercises: RoutineExercise[];
};

function formatRest(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`;
}

function formatCategory(cat: string): string {
  return cat
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDifficulty(d: string): string {
  return d.charAt(0).toUpperCase() + d.slice(1);
}

export function RoutineDetailScreen() {
  const selectedRoutineId = useStore((s) => s.selectedRoutineId);
  const setSelectedRoutineId = useStore((s) => s.setSelectedRoutineId);
  const setTab = useStore((s) => s.setTab);

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!selectedRoutineId) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("routines")
          .select("*")
          .eq("id", selectedRoutineId)
          .maybeSingle();
        if (cancelled) return;
        if (error) {
          console.error("Failed to load routine:", error);
          setRoutine(null);
        } else {
          setRoutine((data as Routine) ?? null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedRoutineId]);

  const exerciseIds = routine?.exercises.map((e) => e.exercise_id) ?? [];
  const { prs } = useLastPRs("demo-user", exerciseIds);

  function goBack() {
    setSelectedRoutineId(null);
    setTab("library");
  }

  if (isLoading) {
    return (
      <div className="px-5 pt-3 pb-28">
        <button onClick={goBack} className="flex items-center gap-2 text-text-secondary text-sm mb-6">
          <ArrowLeft size={18} /> Library
        </button>
        <div className="text-center text-text-tertiary text-sm py-8">Loading routine...</div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="px-5 pt-3 pb-28">
        <button onClick={goBack} className="flex items-center gap-2 text-text-secondary text-sm mb-6">
          <ArrowLeft size={18} /> Library
        </button>
        <div className="text-center text-text-tertiary text-sm py-8">Routine not found.</div>
      </div>
    );
  }

  const exercises = [...routine.exercises].sort((a, b) => a.order - b.order);

  return (
    <div className="px-5 pt-3 pb-28 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goBack} className="flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors">
          <ArrowLeft size={18} />
          Library
        </button>
        <button
          onClick={() => alert("Edit routine coming soon")}
          className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="More options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <h1 className="text-[32px] font-bold leading-tight tracking-tight mb-3">{routine.name}</h1>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/25 uppercase tracking-wider">
          {formatCategory(routine.category)}
        </span>
        <span className="text-[11px] text-text-tertiary uppercase tracking-wider">
          {formatDifficulty(routine.difficulty)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-[13px] text-text-secondary mb-8">
        {routine.estimated_duration_minutes && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} strokeWidth={2} className="text-text-tertiary" />
            ~{routine.estimated_duration_minutes} min
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Dumbbell size={13} strokeWidth={2} className="text-text-tertiary" />
          {exercises.length} exercises
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.12em]">
          Exercises
        </div>
        <div className="text-[11px] text-text-tertiary">{exercises.length}</div>
      </div>

      <div className="space-y-2.5 mb-8">
        {exercises.map((ex, idx) => {
          const exerciseData = EXERCISES.find((e) => e.id === ex.exercise_id);
          const thumbnail = exerciseData?.image_urls?.[0];
          const name = exerciseData?.name ?? ex.exercise_id;
          const muscle = exerciseData?.primary_muscle ?? "";
          const equipment = exerciseData?.equipment ?? "";
          const lastPR = prs.get(ex.exercise_id);

          return (
            <div key={idx} className="bg-surface rounded-[16px] p-3.5 flex items-start gap-3.5">
              <div className="relative flex-shrink-0">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={name}
                    className="w-[72px] h-[72px] rounded-[14px] object-cover bg-surface2"
                  />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-[14px] bg-surface2" />
                )}
                <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-bg border border-white/10 flex items-center justify-center">
                  <span className="text-[11px] font-bold text-text-primary">{idx + 1}</span>
                </div>
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-[15px] font-semibold text-text-primary leading-snug">{name}</div>
                {(muscle || equipment) && (
                  <div className="text-[11px] text-text-tertiary mt-0.5">
                    {muscle && muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                    {muscle && equipment && " · "}
                    {equipment && equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                  </div>
                )}

                <div className="flex items-center gap-2.5 mt-2.5">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] bg-purple-500/12 border border-purple-500/20">
                    <span className="text-[12px] font-bold text-purple-200 tracking-tight">
                      {ex.sets} × {ex.reps}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-text-tertiary">
                    <Clock size={11} strokeWidth={2} />
                    {formatRest(ex.rest_seconds)}
                  </span>
                </div>
                {prs.get(ex.exercise_id) && (
                  <span className="text-[11px] text-text-secondary whitespace-nowrap flex-shrink-0 mt-1.5 block">
                    <span className="text-text-tertiary">Last PR </span>
                    <span className="font-semibold text-text-primary">
                      {prs.get(ex.exercise_id)!.weight} × {prs.get(ex.exercise_id)!.reps}
                    </span>
                  </span>
                )}

                {ex.notes && (
                  <div className="mt-2.5 pl-2.5 border-l-2 border-purple-500/40 text-[12px] text-text-secondary italic leading-relaxed">
                    {ex.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 w-full max-w-md px-5 z-30">
        <button
          onClick={() => alert("Add to split — wiring this up when the Workout tab / splits system is built")}
          className="w-full py-3.5 rounded-[14px] bg-purple-500 text-white text-[15px] font-semibold hover:bg-purple-600 active:scale-[0.99] transition-all shadow-lg shadow-purple-500/30 inline-flex items-center justify-center gap-2"
        >
          <PlusCircle size={17} strokeWidth={2.2} />
          Add to split
        </button>
      </div>
    </div>
  );
}
