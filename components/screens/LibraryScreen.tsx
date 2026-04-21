"use client";

import { useEffect, useState } from "react";
import { Search, ChevronRight, Plus, Dumbbell, Sparkles, Pencil, Link2, X } from "lucide-react";
import clsx from "clsx";
import { EXERCISES } from "@/lib/data/exercises";
import { supabase } from "@/lib/supabase";
import { ensureUserLibrarySeeded } from "@/lib/data/seedUserRoutines";

const FILTERS = [
  "All",
  "Push",
  "Pull",
  "Legs",
  "Upper",
  "Lower",
  "Full Body",
  "Core",
  "Cardio",
  "Pilates",
  "Stretch",
];
const SUB_TABS = [
  { label: "My Routines", value: "my" },
  { label: "Browse", value: "browse" },
  { label: "Exercises", value: "exercises" },
] as const;
const EXERCISE_MUSCLE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Chest", value: "chest" },
  { label: "Back", value: "back" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Biceps", value: "biceps" },
  { label: "Triceps", value: "triceps" },
  { label: "Quads", value: "quads" },
  { label: "Hamstrings", value: "hamstrings" },
  { label: "Glutes", value: "glutes" },
  { label: "Calves", value: "calves" },
  { label: "Core", value: "core" },
  { label: "Forearms", value: "forearms" },
] as const;

type Routine = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  difficulty: string;
  estimated_duration_minutes: number | null;
  exercises: Array<{
    exercise_id: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    order: number;
    notes?: string;
  }>;
  source: string;
};

function getMuscleFocus(routine: Routine): string {
  const muscles = new Set<string>();
  routine.exercises.forEach((ex) => {
    const match = EXERCISES.find((e) => e.id === ex.exercise_id);
    if (match) muscles.add(match.primary_muscle);
  });
  const list = Array.from(muscles).slice(0, 3);
  return list.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(" · ");
}

export function LibraryScreen() {
  const [filter, setFilter] = useState("All");
  const [subTab, setSubTab] = useState<"my" | "browse" | "exercises">("my");
  const [exerciseQuery, setExerciseQuery] = useState<string>("");
  const [muscleFilter, setMuscleFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await ensureUserLibrarySeeded("demo-user");
        const { data, error } = await supabase
          .from("routines")
          .select("*")
          .eq("user_id", "demo-user")
          .order("created_at", { ascending: true });
        if (cancelled) return;
        if (error) {
          console.error("Failed to load routines:", error);
          setRoutines([]);
        } else {
          setRoutines((data ?? []) as Routine[]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Library load failed:", err);
          setRoutines([]);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredExercises = EXERCISES.filter((exercise) => {
    if (muscleFilter !== "all" && exercise.primary_muscle !== muscleFilter) {
      return false;
    }

    if (
      exerciseQuery.trim().length > 0 &&
      !exercise.name.toLowerCase().includes(exerciseQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
  const displayedExercises = filteredExercises.slice(0, 100);
  const filteredRoutines = routines.filter((r) => {
    if (filter === "All") return true;
    const categoryKey = filter.toLowerCase().replace(" ", "_");
    return r.category === categoryKey;
  });

  return (
    <>
      <div className="px-5 pt-2 pb-28 animate-fade-in">
        <h1 className="text-2xl font-bold mb-[18px]">Library</h1>

        {subTab === "my" && (
          <>
            {/* Search */}
            <div className="bg-surface rounded-[10px] flex items-center gap-2.5 px-3.5 py-3 mb-4">
              <Search size={15} className="text-text-placeholder" />
              <span className="text-sm text-text-placeholder">
                Search routines
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                    filter === f
                      ? "bg-white text-bg"
                      : "bg-surface text-text-secondary"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setSheetOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-5 rounded-[12px] bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              <Plus size={18} strokeWidth={2.5} />
              New routine
            </button>

            {isLoading ? (
              <div className="text-center text-text-tertiary text-sm py-8">
                Loading your library...
              </div>
            ) : filteredRoutines.length === 0 ? (
              <div className="text-center text-text-tertiary text-sm py-8">
                No routines in this category yet.
              </div>
            ) : (
              <>
                <div className="section-label mb-3">
                  Your Routines — {filteredRoutines.length}
                </div>
                {filteredRoutines.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => alert(`${r.name} detail screen coming in Step 7`)}
                    className="w-full bg-surface rounded-card p-4 mb-2.5 flex items-center gap-3 text-left hover:bg-surface2 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-[10px] bg-surface2 flex items-center justify-center flex-shrink-0">
                      <Dumbbell
                        size={18}
                        className="text-text-tertiary"
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-semibold text-text-primary truncate">
                        {r.name}
                      </div>
                      <div className="text-xs text-text-secondary mt-0.5 truncate">
                        {getMuscleFocus(r) || "No exercises"}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        {r.exercises.length} exercises
                        {r.estimated_duration_minutes
                          ? ` · ~${r.estimated_duration_minutes} min`
                          : ""}
                      </div>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-text-tertiary flex-shrink-0"
                    />
                  </button>
                ))}
              </>
            )}
          </>
        )}

        {subTab === "browse" && (
          <>
            <button
              onClick={() => setSheetOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-5 rounded-[12px] bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              <Plus size={18} strokeWidth={2.5} />
              New routine
            </button>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-text-secondary text-sm mb-2">Coming soon</div>
              <div className="text-text-tertiary text-xs">
                Pre-built routines from Forge
              </div>
            </div>
          </>
        )}

        {subTab === "exercises" && (
          <>
            <button
              onClick={() => setSheetOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-5 rounded-[12px] bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              <Plus size={18} strokeWidth={2.5} />
              New routine
            </button>
            <div className="bg-surface rounded-[10px] flex items-center gap-2.5 px-3.5 py-3 mb-4">
              <Search size={15} className="text-text-placeholder" />
              <input
                value={exerciseQuery}
                onChange={(e) => setExerciseQuery(e.target.value)}
                placeholder="Search exercises..."
                className="bg-transparent outline-none w-full text-sm text-text-primary placeholder:text-text-placeholder"
              />
            </div>

            <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-0.5">
              {EXERCISE_MUSCLE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setMuscleFilter(f.value)}
                  className={clsx(
                    "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors",
                    muscleFilter === f.value
                      ? "bg-white text-bg"
                      : "bg-surface text-text-secondary"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="section-label mb-3">
              Exercises — {filteredExercises.length}
            </div>

            {displayedExercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => alert(`${exercise.name} details coming soon`)}
                className="w-full bg-surface rounded-card p-3 mb-2 flex items-center gap-3 text-left hover:bg-surface2 transition-colors"
              >
                {exercise.image_urls.length > 0 ? (
                  <img
                    src={exercise.image_urls[0]}
                    className="w-14 h-14 rounded-[12px] object-cover bg-surface2 flex-shrink-0"
                    alt={exercise.name}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-[12px] bg-surface2 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary text-[15px] font-medium truncate">
                    {exercise.name}
                  </div>
                  <div className="text-text-tertiary text-xs mt-0.5 truncate">
                    {`${capitalize(exercise.primary_muscle)} · ${capitalize(exercise.equipment)}`}
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-text-tertiary flex-shrink-0"
                />
              </button>
            ))}

            {filteredExercises.length > 100 && (
              <div className="text-center text-text-tertiary text-xs py-4">
                Showing 100 of {filteredExercises.length} — refine filters to
                see more
              </div>
            )}
          </>
        )}
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-fade-in">
          {/* Blurred + dimmed backdrop */}
          <div
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Glass modal */}
          <div className="relative w-full max-w-sm bg-surface/85 backdrop-blur-2xl rounded-[24px] px-4 pt-5 pb-5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)]">
            {/* Close button */}
            <button
              onClick={() => setSheetOpen(false)}
              className="absolute top-3.5 right-3.5 p-1 text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-5 mt-1">
              <div className="text-base font-semibold text-text-primary">New routine</div>
              <div className="text-xs text-text-secondary mt-0.5">Choose how to create it</div>
            </div>

            {/* Option 1 */}
            <button
              onClick={() => { setSheetOpen(false); alert("Build with AI coming soon"); }}
              className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-[14px] mb-2 border border-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">Build with AI</div>
                <div className="text-xs text-text-secondary mt-0.5">Describe your goal, AI creates it</div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
            </button>

            {/* Option 2 */}
            <button
              onClick={() => { setSheetOpen(false); alert("Custom builder coming soon"); }}
              className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-[14px] mb-2 border border-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Pencil size={18} className="text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">Custom</div>
                <div className="text-xs text-text-secondary mt-0.5">Build from scratch, exercise by exercise</div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
            </button>

            {/* Option 3 */}
            <button
              onClick={() => { setSheetOpen(false); alert("Import from link coming soon"); }}
              className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-[14px] border border-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Link2 size={18} className="text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">Import from link</div>
                <div className="text-xs text-text-secondary mt-0.5">From a YouTube or social video</div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
