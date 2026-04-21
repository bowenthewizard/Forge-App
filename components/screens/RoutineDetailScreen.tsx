"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Dumbbell, GripVertical, Minus, Plus, PlusCircle, Repeat } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { EXERCISES } from "@/lib/data/exercises";
import { useLastPRs } from "@/lib/hooks/useLastPRs";
import ExercisePicker from "@/components/ExercisePicker";
import SortableItem from "@/components/SortableItem";

function generateSortId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `sort-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

type RoutineExercise = {
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  order: number;
  notes?: string;
  _sortId?: string;
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [localExercises, setLocalExercises] = useState<any[] | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalSets, setModalSets] = useState<number>(1);
  const [modalReps, setModalReps] = useState<string>("");
  const [modalRest, setModalRest] = useState<number>(60);
  const [setsEditing, setSetsEditing] = useState(false);
  const [repsEditing, setRepsEditing] = useState(false);
  const [restEditing, setRestEditing] = useState(false);
  const [pickerMode, setPickerMode] = useState<"add" | "substitute" | null>(null);

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
          const routineData = data as Routine | null;
          if (!routineData) {
            setRoutine(null);
          } else {
            setRoutine({
              ...routineData,
              exercises: (routineData.exercises ?? []).map((e: any) => ({
                ...e,
                _sortId: e._sortId ?? generateSortId(),
              })),
            });
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [selectedRoutineId]);

  useEffect(() => {
    if (isEditMode && routine) {
      setLocalExercises(
        routine.exercises.map((e: any) => ({
          ...e,
          _sortId: e._sortId ?? generateSortId(),
        }))
      );
    } else if (!isEditMode) {
      setLocalExercises(null);
      setEditingIndex(null);
    }
  }, [isEditMode, routine]);

  useEffect(() => {
    if (editingIndex !== null && localExercises && localExercises[editingIndex]) {
      const ex = localExercises[editingIndex];
      setModalSets(Number(ex.sets) || 1);
      setModalReps(String(ex.reps ?? ""));
      setModalRest(Number(ex.rest_seconds) || 60);
      setSetsEditing(false);
      setRepsEditing(false);
      setRestEditing(false);
    }
  }, [editingIndex, localExercises]);

  const exerciseIds = routine?.exercises.map((e) => e.exercise_id) ?? [];
  const { prs } = useLastPRs("demo-user", exerciseIds);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || !localExercises) return;
    const oldIndex = localExercises.findIndex((e: any) => e._sortId === active.id);
    const newIndex = localExercises.findIndex((e: any) => e._sortId === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const moved = arrayMove(localExercises, oldIndex, newIndex);
    setLocalExercises(
      moved.map((exercise: any, index: number) => ({
        ...exercise,
        order: index,
      }))
    );
  }

  function goBack() {
    setSelectedRoutineId(null);
    setTab("library");
  }

  // Parse reps which may be a single number ("5") or a range ("8-12"). Returns nulls if unparseable.
  function parseReps(value: string): { low: number; high: number; isRange: boolean } | null {
    const trimmed = value.trim();
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const low = parseInt(rangeMatch[1]);
      const high = parseInt(rangeMatch[2]);
      if (!isNaN(low) && !isNaN(high)) return { low, high, isRange: true };
    }
    const singleMatch = trimmed.match(/^(\d+)$/);
    if (singleMatch) {
      const n = parseInt(singleMatch[1]);
      if (!isNaN(n)) return { low: n, high: n, isRange: false };
    }
    return null;
  }

  function stepReps(direction: 1 | -1) {
    const parsed = parseReps(modalReps);
    if (!parsed) return; // unparseable (e.g., "AMRAP") — steppers no-op, tap-to-edit still works
    const newLow = Math.max(1, parsed.low + direction);
    const newHigh = Math.max(newLow, parsed.high + direction);
    setModalReps(parsed.isRange ? `${newLow}-${newHigh}` : String(newLow));
  }

  async function handleSaveChanges() {
    if (!routine || !localExercises) return;
    setIsSaving(true);
    const exercisesToSave = localExercises.map((exercise: any, index: number) => ({
      ...exercise,
      order: index,
    }));
    const { error } = await supabase
      .from("routines")
      .update({
        exercises: exercisesToSave,
        updated_at: new Date().toISOString(),
      })
      .eq("id", routine.id);

    if (error) {
      console.error("Failed to save routine:", error);
      alert("Failed to save changes. Please try again.");
      setIsSaving(false);
      return;
    }

    setRoutine({ ...routine, exercises: exercisesToSave });
    setIsEditMode(false);
    setIsSaving(false);
  }

  function handleCancelEdit() {
    setIsEditMode(false);
  }

  function handleModalSave() {
    if (editingIndex === null || !localExercises) return;
    const updated = [...localExercises];
    updated[editingIndex] = {
      ...updated[editingIndex],
      sets: modalSets,
      reps: modalReps,
      rest_seconds: modalRest,
    };
    setLocalExercises(updated);
    setEditingIndex(null);
  }

  function handleModalCancel() {
    setEditingIndex(null);
  }

  function handleDeleteExercise(idx: number) {
    if (!localExercises) return;
    const updated = localExercises.filter((_: any, i: number) => i !== idx);
    setLocalExercises(updated);
  }

  function handlePickerSelect(exerciseId: string) {
    if (!localExercises) {
      setPickerMode(null);
      return;
    }

    if (pickerMode === "add") {
      const newExercise = {
        exercise_id: exerciseId,
        sets: 3,
        reps: "8-12",
        rest_seconds: 90,
        notes: null,
        order: localExercises.length,
        _sortId: generateSortId(),
      };
      setLocalExercises([...localExercises, newExercise]);
    } else if (pickerMode === "substitute" && editingIndex !== null) {
      const updated = [...localExercises];
      updated[editingIndex] = {
        ...updated[editingIndex],
        exercise_id: exerciseId,
      };
      setLocalExercises(updated);
    }

    setPickerMode(null);
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
  const displayExercises = isEditMode && localExercises ? localExercises : routine.exercises;

  return (
    <div className="px-5 pt-3 pb-28 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={goBack} className="flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors">
          <ArrowLeft size={18} />
          Library
        </button>
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="text-[14px] font-semibold text-purple-400 hover:text-purple-300 active:scale-95 transition-all px-2 py-1"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleCancelEdit}
            className="text-[14px] font-semibold text-text-secondary hover:text-text-primary active:scale-95 transition-all px-2 py-1"
          >
            Cancel
          </button>
        )}
      </div>

      <h1 className="text-[32px] font-bold leading-tight tracking-tight mb-3">{routine.name}</h1>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-transparent text-white/90 border border-white/30 uppercase tracking-wider">
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
          {displayExercises.length} exercises
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.12em]">
          Exercises
        </div>
        <div className="text-[11px] text-text-tertiary">{displayExercises.length}</div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={displayExercises.map((e: any) => e._sortId)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2.5 mb-8">
            {displayExercises.map((ex: any, idx: number) => {
              const sortId = ex._sortId as string;
              const exerciseData = EXERCISES.find((e) => e.id === ex.exercise_id);
              const thumbnail = exerciseData?.image_urls?.[0];
              const name = exerciseData?.name ?? ex.exercise_id;
              const muscle = exerciseData?.primary_muscle ?? "";
              const equipment = exerciseData?.equipment ?? "";
              const lastPR = prs.get(ex.exercise_id);

              return (
                <SortableItem key={sortId} id={sortId} disabled={!isEditMode}>
                  {({ setNodeRef, style, listeners, attributes, isDragging }) => (
                    <div
                      ref={setNodeRef}
                      style={style}
                      onClick={isEditMode ? () => setEditingIndex(idx) : undefined}
                      className={`bg-surface rounded-[16px] p-3.5 flex items-start gap-3.5 ${
                        isEditMode ? "cursor-pointer hover:bg-surface2 active:scale-[0.995] transition-all" : ""
                      } ${isDragging ? "shadow-2xl ring-2 ring-purple-500/40" : ""}`}
                    >
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
                        {!isEditMode ? (
                          <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-bg border border-white/10 flex items-center justify-center">
                            <span className="text-[11px] font-bold text-text-primary">{idx + 1}</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExercise(idx);
                            }}
                            className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-bg border border-white/15 hover:border-red-500/60 hover:bg-red-500/15 active:scale-90 flex items-center justify-center transition-all z-10 group"
                            aria-label="Remove exercise"
                          >
                            <Minus size={13} strokeWidth={2.5} className="text-text-tertiary group-hover:text-red-400 transition-colors" />
                          </button>
                        )}
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

                        <div className="flex items-center justify-between gap-2 mt-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="inline-flex items-center text-[12px] text-text-secondary font-semibold tracking-tight whitespace-nowrap flex-shrink-0">
                              {ex.sets} × {ex.reps}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-text-tertiary whitespace-nowrap">
                              <Clock size={11} strokeWidth={2} />
                              {formatRest(ex.rest_seconds)}
                            </span>
                          </div>

                          {prs.get(ex.exercise_id) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-purple-500/15 border border-purple-400/30 flex-shrink-0">
                              <span className="text-[9px] font-bold text-purple-300 uppercase tracking-[0.1em]">
                                PR
                              </span>
                              <span className="text-[12px] font-bold text-purple-100 tracking-tight whitespace-nowrap">
                                {prs.get(ex.exercise_id)!.weight} × {prs.get(ex.exercise_id)!.reps}
                              </span>
                            </span>
                          )}
                        </div>

                        {ex.notes && (
                          <div className="mt-2.5 pl-2.5 border-l-2 border-purple-500/40 text-[12px] text-text-secondary italic leading-relaxed">
                            {ex.notes}
                          </div>
                        )}
                      </div>
                      {isEditMode && (
                        <div
                          {...attributes}
                          {...listeners}
                          className="flex-shrink-0 self-center pl-1 pr-1 cursor-grab active:cursor-grabbing text-text-tertiary hover:text-text-primary transition-colors touch-none"
                          onClick={(e) => e.stopPropagation()}
                          aria-label="Drag to reorder"
                        >
                          <GripVertical size={22} strokeWidth={2.2} />
                        </div>
                      )}
                    </div>
                  )}
                </SortableItem>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {isEditMode && (
        <button
          onClick={() => setPickerMode("add")}
          className="w-full mb-8 py-3.5 rounded-[14px] border border-dashed border-purple-500/40 hover:border-purple-500/70 hover:bg-purple-500/5 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 text-[14px] font-semibold"
        >
          <PlusCircle size={16} strokeWidth={2.2} />
          Add Exercise
        </button>
      )}

      <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 w-full max-w-md px-5 z-30">
        {!isEditMode ? (
          <button
            onClick={() => alert("Add to split — wiring this up when the Workout tab / splits system is built")}
            className="w-full py-3.5 rounded-[14px] bg-purple-500 text-white text-[15px] font-semibold hover:bg-purple-600 active:scale-[0.99] transition-all shadow-lg shadow-purple-500/30 inline-flex items-center justify-center gap-2"
          >
            <PlusCircle size={17} strokeWidth={2.2} />
            Add to split
          </button>
        ) : (
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-full py-3.5 rounded-[14px] bg-purple-500 text-white text-[15px] font-semibold hover:bg-purple-600 active:scale-[0.99] transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {editingIndex !== null && localExercises && localExercises[editingIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={handleModalCancel}
        >
          <div
            className="w-full max-w-sm bg-surface/90 backdrop-blur-2xl rounded-[24px] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
              <button
                onClick={handleModalCancel}
                className="text-[14px] font-semibold text-text-secondary hover:text-text-primary active:scale-95 transition-all"
              >
                Cancel
              </button>
              <div className="text-[10px] font-semibold text-text-tertiary uppercase tracking-[0.14em]">
                Edit Exercise
              </div>
              <button
                onClick={handleModalSave}
                className="text-[14px] font-semibold text-purple-400 hover:text-purple-300 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>

            {/* Exercise identity row with swap */}
            <div className="px-5 pt-4 pb-4 flex items-center gap-3 border-b border-white/5">
              {(() => {
                const ex = localExercises[editingIndex];
                const data = EXERCISES.find((e) => e.id === ex.exercise_id);
                const thumb = data?.image_urls?.[0];
                const name = data?.name ?? ex.exercise_id;
                return (
                  <>
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={name}
                        className="w-12 h-12 rounded-[10px] object-cover bg-surface2 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-[10px] bg-surface2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold text-text-primary leading-tight truncate">{name}</div>
                      <div className="text-[10px] text-text-tertiary mt-0.5 capitalize">
                        {data?.primary_muscle ?? ""} {data?.equipment ? `· ${data.equipment}` : ""}
                      </div>
                    </div>
                    <button
                      onClick={() => setPickerMode("substitute")}
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                      aria-label="Substitute exercise"
                    >
                      <Repeat size={14} strokeWidth={2.2} />
                    </button>
                  </>
                );
              })()}
            </div>

            {/* Stepper controls — compact */}
            <div className="px-5 py-5 space-y-4">
              {/* Sets */}
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.1em]">Sets</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalSets(Math.max(1, modalSets - 1))}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                    aria-label="Decrease sets"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  {setsEditing ? (
                    <input
                      type="number"
                      min={1}
                      max={20}
                      autoFocus
                      value={modalSets}
                      onChange={(e) => setModalSets(parseInt(e.target.value) || 1)}
                      onBlur={() => setSetsEditing(false)}
                      onKeyDown={(e) => { if (e.key === "Enter") setSetsEditing(false); }}
                      className="w-20 h-9 px-2 bg-bg/60 border border-purple-500/50 rounded-[10px] text-center text-[18px] font-bold text-text-primary tracking-tight tabular-nums focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  ) : (
                    <button
                      onClick={() => setSetsEditing(true)}
                      className="w-20 h-9 flex items-center justify-center bg-bg/60 border border-white/10 hover:border-purple-500/40 rounded-[10px] transition-colors"
                      aria-label="Tap to edit sets"
                    >
                      <span className="text-[18px] font-bold text-text-primary tracking-tight tabular-nums">{modalSets}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setModalSets(Math.min(20, modalSets + 1))}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                    aria-label="Increase sets"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Reps */}
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.1em]">Reps</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => stepReps(-1)}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                    aria-label="Decrease reps"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  {repsEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={modalReps}
                      onChange={(e) => setModalReps(e.target.value)}
                      onBlur={() => setRepsEditing(false)}
                      onKeyDown={(e) => { if (e.key === "Enter") setRepsEditing(false); }}
                      placeholder="8-12"
                      className="w-20 h-9 px-2 bg-bg/60 border border-purple-500/50 rounded-[10px] text-center text-[18px] font-bold text-text-primary tracking-tight focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  ) : (
                    <button
                      onClick={() => setRepsEditing(true)}
                      className="w-20 h-9 flex items-center justify-center bg-bg/60 border border-white/10 hover:border-purple-500/40 rounded-[10px] transition-colors"
                      aria-label="Tap to edit reps"
                    >
                      <span className="text-[18px] font-bold text-text-primary tracking-tight tabular-nums">{modalReps || "—"}</span>
                    </button>
                  )}
                  <button
                    onClick={() => stepReps(1)}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                    aria-label="Increase reps"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Rest */}
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.1em]">Rest</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalRest(Math.max(0, modalRest - 15))}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                    aria-label="Decrease rest"
                  >
                    <Minus size={15} strokeWidth={2.5} />
                  </button>
                  {restEditing ? (
                    <input
                      type="number"
                      min={0}
                      step={15}
                      autoFocus
                      value={modalRest}
                      onChange={(e) => setModalRest(parseInt(e.target.value) || 0)}
                      onBlur={() => setRestEditing(false)}
                      onKeyDown={(e) => { if (e.key === "Enter") setRestEditing(false); }}
                      className="w-20 h-9 px-2 bg-bg/60 border border-purple-500/50 rounded-[10px] text-center text-[16px] font-bold text-text-primary tracking-tight tabular-nums focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  ) : (
                    <button
                      onClick={() => setRestEditing(true)}
                      className="w-20 h-9 flex items-center justify-center bg-bg/60 border border-white/10 hover:border-purple-500/40 rounded-[10px] transition-colors"
                      aria-label="Tap to edit rest"
                    >
                      <span className="text-[16px] font-bold text-text-primary tracking-tight tabular-nums">{formatRest(modalRest)}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setModalRest(Math.min(600, modalRest + 15))}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 flex items-center justify-center transition-all active:scale-90 text-text-secondary hover:text-purple-300"
                    aria-label="Increase rest"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExercisePicker
        isOpen={pickerMode !== null}
        mode={pickerMode ?? "add"}
        onClose={() => setPickerMode(null)}
        onSelect={handlePickerSelect}
      />
    </div>
  );
}
