"use client";

import { useState } from "react";
import { Search, ChevronRight, Plus, Dumbbell, Sparkles, Pencil, Link2, X } from "lucide-react";
import clsx from "clsx";
import { EXERCISES } from "@/lib/data/exercises";

const FILTERS = ["All", "Push", "Pull", "Legs", "Upper", "Full Body"];
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

const ROUTINES = [
  { name: "Push Day", sub: "Chest · Shoulders · Triceps", ex: 6, src: "Custom" },
  { name: "Pull Day", sub: "Back · Biceps · Rear Delts", ex: 7, src: "Custom" },
  { name: "Leg Day", sub: "Quads · Hamstrings · Calves", ex: 8, src: "Custom" },
  { name: "CBum Chest & Shoulders", sub: "Chest · Shoulders", ex: 8, src: "YouTube" },
  { name: "Jeff Nippard Upper/Lower", sub: "Upper · Lower Split", ex: 6, src: "YouTube" },
];

export function LibraryScreen() {
  const [filter, setFilter] = useState("All");
  const [subTab, setSubTab] = useState<"my" | "browse" | "exercises">("my");
  const [exerciseQuery, setExerciseQuery] = useState<string>("");
  const [muscleFilter, setMuscleFilter] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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

            <div className="section-label mb-3">Your Routines — {ROUTINES.length}</div>

            {ROUTINES.map((r) => (
              <button
                key={r.name}
                className="w-full bg-surface rounded-card p-4 mb-2.5 flex items-center gap-3 text-left hover:bg-surface2 transition-colors"
              >
                <div className="w-11 h-11 rounded-[10px] bg-surface2 flex items-center justify-center flex-shrink-0">
                  <Dumbbell
                    size={18}
                    className={r.src === "YouTube" ? "text-destructive" : "text-text-tertiary"}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{r.name}</div>
                  <div className="text-xs text-text-tertiary mb-1.5 truncate">
                    {r.sub}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[11px] text-text-tertiary">
                      {r.ex} exercises
                    </span>
                    {r.src === "YouTube" && (
                      <span className="text-[10px] font-semibold bg-destructive/[0.12] text-destructive px-2 py-0.5 rounded-lg">
                        YT
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-placeholder" />
              </button>
            ))}
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
        <>
          {/* backdrop */}
          <div
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
          />
          {/* sheet */}
          <div className="fixed left-0 right-0 bottom-0 z-50 bg-surface/95 backdrop-blur-xl border-t border-white/10 rounded-t-[24px] px-4 pt-3 pb-8 animate-slide-up">
            {/* drag handle */}
            <div className="w-9 h-1 bg-white/20 rounded-full mx-auto mb-4" />

            <button
              onClick={() => setSheetOpen(false)}
              className="absolute top-3 right-4 p-1.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="text-center mb-5">
              <div className="text-base font-semibold text-text-primary">
                New routine
              </div>
              <div className="text-xs text-text-secondary mt-0.5">
                Choose how to create it
              </div>
            </div>

            {/* Option 1: Build with AI */}
            <button
              onClick={() => {
                setSheetOpen(false);
                alert("Build with AI coming soon");
              }}
              className="w-full flex items-center gap-3 p-3 bg-bg rounded-[12px] mb-2 border border-white/5 hover:bg-surface2 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-purple-500/18 flex items-center justify-center flex-shrink-0">
                <Sparkles size={18} className="text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">
                  Build with AI
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  Describe your goal, AI creates it
                </div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
            </button>

            {/* Option 2: Custom */}
            <button
              onClick={() => {
                setSheetOpen(false);
                alert("Custom builder coming soon");
              }}
              className="w-full flex items-center gap-3 p-3 bg-bg rounded-[12px] mb-2 border border-white/5 hover:bg-surface2 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-purple-500/18 flex items-center justify-center flex-shrink-0">
                <Pencil size={18} className="text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">
                  Custom
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  Build from scratch, exercise by exercise
                </div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
            </button>

            {/* Option 3: Import from link */}
            <button
              onClick={() => {
                setSheetOpen(false);
                alert("Import from link coming soon");
              }}
              className="w-full flex items-center gap-3 p-3 bg-bg rounded-[12px] border border-white/5 hover:bg-surface2 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-purple-500/18 flex items-center justify-center flex-shrink-0">
                <Link2 size={18} className="text-purple-400" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text-primary">
                  Import from link
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  From a YouTube or social video
                </div>
              </div>
              <ChevronRight size={16} className="text-text-tertiary flex-shrink-0" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
