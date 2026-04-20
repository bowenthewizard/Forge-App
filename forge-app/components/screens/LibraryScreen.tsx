"use client";

import { useState } from "react";
import { Search, ChevronRight, Plus, Dumbbell } from "lucide-react";
import clsx from "clsx";

const FILTERS = ["All", "Push", "Pull", "Legs", "Upper", "Full Body"];

const ROUTINES = [
  { name: "Push Day", sub: "Chest · Shoulders · Triceps", ex: 6, src: "Custom" },
  { name: "Pull Day", sub: "Back · Biceps · Rear Delts", ex: 7, src: "Custom" },
  { name: "Leg Day", sub: "Quads · Hamstrings · Calves", ex: 8, src: "Custom" },
  { name: "CBum Chest & Shoulders", sub: "Chest · Shoulders", ex: 8, src: "YouTube" },
  { name: "Jeff Nippard Upper/Lower", sub: "Upper · Lower Split", ex: 6, src: "YouTube" },
];

export function LibraryScreen() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="px-5 pt-2 pb-28 animate-fade-in">
      <h1 className="text-2xl font-bold mb-[18px]">Library</h1>

      {/* Search */}
      <div className="bg-surface rounded-[10px] flex items-center gap-2.5 px-3.5 py-3 mb-4">
        <Search size={15} className="text-text-placeholder" />
        <span className="text-sm text-text-placeholder">
          Search workouts, exercises...
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

      {/* THE purple element for this screen */}
      <button className="w-full h-12 bg-purple hover:bg-purple-pressed transition-colors rounded-button flex items-center justify-center gap-2 font-semibold text-sm mt-2">
        <Plus size={15} strokeWidth={2.5} />
        New Routine
      </button>
    </div>
  );
}
