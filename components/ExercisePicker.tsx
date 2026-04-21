"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EXERCISES, type MuscleGroup } from "@/lib/data/exercises";

interface ExercisePickerProps {
  isOpen: boolean;
  mode: "add" | "substitute";
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
}

const MUSCLE_FILTERS: Array<{ label: string; value: MuscleGroup | "all" }> = [
  { label: "All", value: "all" },
  { label: "Chest", value: "chest" },
  { label: "Back", value: "back" },
  { label: "Shoulders", value: "shoulders" },
  { label: "Biceps", value: "biceps" },
  { label: "Triceps", value: "triceps" },
  { label: "Forearms", value: "forearms" },
  { label: "Quads", value: "quads" },
  { label: "Hamstrings", value: "hamstrings" },
  { label: "Glutes", value: "glutes" },
  { label: "Calves", value: "calves" },
  { label: "Core", value: "core" },
];

export default function ExercisePicker({
  isOpen,
  mode,
  onClose,
  onSelect,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | "all">("all");

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EXERCISES.filter((ex) => {
      if (selectedMuscle !== "all" && ex.primary_muscle !== selectedMuscle) return false;
      if (q && !ex.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [searchQuery, selectedMuscle]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-[85vh] bg-surface/95 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-[14px] font-semibold text-text-secondary hover:text-text-primary active:scale-95 transition-all"
          >
            Cancel
          </button>
          <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.14em]">
            {mode === "add" ? "Add Exercise" : "Substitute Exercise"}
          </div>
          <div className="w-[50px]" />
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-3 flex-shrink-0">
          <div className="relative">
            <Search
              size={15}
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
              className="w-full h-10 pl-10 pr-3 bg-bg/60 border border-white/10 rounded-[12px] text-text-primary text-[14px] focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
        </div>

        {/* Muscle filter pills */}
        <div className="flex-shrink-0 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 px-5 pb-3">
            {MUSCLE_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedMuscle(filter.value)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
                  selectedMuscle === filter.value
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/5"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-3 py-1">
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12 text-text-tertiary text-[13px]">
              No exercises match your search
            </div>
          ) : (
            <div className="space-y-1 pb-3">
              {filteredExercises.map((ex) => {
                const thumb = ex.image_urls?.[0];
                return (
                  <button
                    key={ex.id}
                    onClick={() => onSelect(ex.id)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-[12px] hover:bg-white/5 active:scale-[0.99] transition-all text-left"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={ex.name}
                        loading="lazy"
                        className="w-12 h-12 rounded-[10px] object-cover bg-surface2 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-[10px] bg-surface2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-text-primary leading-tight truncate">
                        {ex.name}
                      </div>
                      <div className="text-[11px] text-text-tertiary mt-0.5 capitalize truncate">
                        {ex.primary_muscle} · {ex.equipment}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Result count footer */}
        <div className="flex-shrink-0 px-5 py-2.5 border-t border-white/5 text-center text-[11px] text-text-tertiary">
          {filteredExercises.length} exercise{filteredExercises.length === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}
