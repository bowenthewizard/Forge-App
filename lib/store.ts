"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { DEMO_PUSH_DAY } from "@/lib/demo-data";

// ---- TYPES ----
export type ExerciseSet = {
  n: number;
  prev: string;      // e.g. "225 × 8"
  weight: string;    // logged weight (user input)
  reps: string;      // logged reps (user input)
  done: boolean;
};

export type Exercise = {
  id: number;
  name: string;
  equipment: "Barbell" | "Dumbbell" | "Machine" | "Cables" | "Bands" | "Bodyweight";
  muscleGroups: string[];
  sets: ExerciseSet[];
};

export type CompletedWorkoutSnapshot = {
  name: string;
  durationSeconds: number;
  totalVolume: number;
  exercises: Array<{
    name: string;
    equipment: string;
    sets: Array<{
      n: number;
      weight: string;
      reps: string;
    }>;
  }>;
  prs: Array<{ exerciseName: string; weight: number; reps: number }>;
  volumeDeltaVsLastTime: number | null;
};

export type Tab = "home" | "workout" | "library" | "profile" | "summary";

type StoreState = {
  // Navigation
  tab: Tab;
  setTab: (tab: Tab) => void;

  // Workout state
  workoutName: string;
  workoutStartedAt: number | null;
  workoutElapsed: number;
  isSaving: boolean;
  completedWorkout: CompletedWorkoutSnapshot | null;
  tickWorkout: () => void;
  startWorkout: () => void;
  finishWorkout: () => Promise<void>;
  dismissSummary: () => void;

  // Exercises
  exercises: Exercise[];
  toggleSet: (exIdx: number, setIdx: number) => void;
  updateSet: (exIdx: number, setIdx: number, field: "weight" | "reps", value: string) => void;
  addSet: (exIdx: number) => void;
  completeAllSets: (exerciseIdx: number) => void;

  // Rest timer
  restActive: boolean;
  restSeconds: number;
  restMax: number;
  restExercise: string;
  startRest: (exerciseName: string, duration?: number) => void;
  tickRest: () => void;
  skipRest: () => void;
};

// ---- STORE ----
export const useStore = create<StoreState>((set, get) => ({
  // Nav
  tab: "home",
  setTab: (tab) => set({ tab }),

  // Workout
  workoutName: "Push Day",
  workoutStartedAt: null,
  workoutElapsed: 0,
  isSaving: false,
  completedWorkout: null,
  tickWorkout: () => {
    const started = get().workoutStartedAt;
    if (started) set({ workoutElapsed: Math.floor((Date.now() - started) / 1000) });
  },
  startWorkout: () => {
    set({
      workoutStartedAt: Date.now(),
      workoutElapsed: 0,
      tab: "workout",
    });
  },
  finishWorkout: async () => {
    set({ isSaving: true });

    const { workoutName, workoutStartedAt, workoutElapsed, exercises } = get();
    const totalVolume = exercises.reduce((exerciseSum, exercise) => {
      const setVolume = exercise.sets.reduce((sum, workoutSet) => {
        if (!workoutSet.done) return sum;
        const weight = parseFloat(workoutSet.weight);
        const reps = parseInt(workoutSet.reps, 10);
        if (!Number.isFinite(weight) || !Number.isFinite(reps)) return sum;
        return sum + weight * reps;
      }, 0);

      return exerciseSum + setVolume;
    }, 0);
    const roundedTotalVolume = Math.round(totalVolume);

    const completedWorkout: CompletedWorkoutSnapshot = {
      name: workoutName,
      durationSeconds: workoutElapsed,
      totalVolume: roundedTotalVolume,
      exercises: exercises
        .map((exercise) => ({
          name: exercise.name,
          equipment: exercise.equipment,
          sets: exercise.sets
            .filter((workoutSet) => workoutSet.done)
            .map((workoutSet) => ({
              n: workoutSet.n,
              weight: workoutSet.weight,
              reps: workoutSet.reps,
            })),
        }))
        .filter((exercise) => exercise.sets.length > 0),
      prs: [],
      volumeDeltaVsLastTime: null,
    };
    set({ completedWorkout });

    try {
      const sessionPayload = {
        user_id: "demo-user",
        name: workoutName,
        started_at: workoutStartedAt
          ? new Date(workoutStartedAt).toISOString()
          : new Date().toISOString(),
        finished_at: new Date().toISOString(),
        duration_seconds: workoutElapsed,
        total_volume_lbs: roundedTotalVolume,
      };

      const { data: session, error: sessionError } = await supabase
        .from("workout_sessions")
        .insert(sessionPayload)
        .select()
        .single();

      if (sessionError) {
        throw sessionError;
      }

      if (session) {
        const setsArray = exercises.flatMap((exercise) =>
          exercise.sets
            .filter((workoutSet) => workoutSet.done && workoutSet.weight !== "" && workoutSet.reps !== "")
            .map((workoutSet) => ({
              workout_session_id: session.id,
              exercise_name: exercise.name,
              equipment_type: exercise.equipment,
              set_number: workoutSet.n,
              weight: parseFloat(workoutSet.weight),
              reps: parseInt(workoutSet.reps, 10),
              completed: true,
            }))
            .filter((setRow) => Number.isFinite(setRow.weight) && Number.isFinite(setRow.reps))
        );

        if (setsArray.length > 0) {
          const { error: setsError } = await supabase.from("workout_sets").insert(setsArray);
          if (setsError) {
            throw setsError;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

    set({
      workoutStartedAt: null,
      workoutElapsed: 0,
      tab: "summary",
      restActive: false,
      restSeconds: 0,
      restMax: 180,
      restExercise: "",
      exercises: DEMO_PUSH_DAY.map((e) => ({
        ...e,
        sets: e.sets.map((s) => ({ ...s, done: false, weight: "", reps: "" })),
      })),
      isSaving: false,
    });
  },
  dismissSummary: () => set({ completedWorkout: null, tab: "home" }),

  // Exercises
  exercises: structuredClone(DEMO_PUSH_DAY) as Exercise[],
  toggleSet: (exIdx, setIdx) => {
    const exercises = structuredClone(get().exercises);
    const s = exercises[exIdx].sets[setIdx];
    const willBeDone = !s.done;

    if (willBeDone) {
      // If weight or reps missing, auto-fill from prev
      if (!s.weight || !s.reps) {
        const prev = s.prev || "";
        const parts = prev.split("×").map((p) => p.trim());
        if (parts.length === 2) {
          const w = parts[0].replace(/[^0-9.]/g, "");
          const r = parts[1].replace(/[^0-9]/g, "");
          if (!s.weight) s.weight = w;
          if (!s.reps) s.reps = r;
        }
      }
    }

    s.done = willBeDone;
    set({ exercises });
    if (s.done) {
      get().startRest(exercises[exIdx].name);
    }
  },
  updateSet: (exIdx, setIdx, field, value) => {
    const exercises = structuredClone(get().exercises);
    exercises[exIdx].sets[setIdx][field] = value;
    set({ exercises });
  },
  addSet: (exIdx) => {
    const exercises = structuredClone(get().exercises);
    const sets = exercises[exIdx].sets;
    const last = sets[sets.length - 1];
    sets.push({
      n: sets.length + 1,
      prev: last.prev,
      weight: "",
      reps: "",
      done: false,
    });
    set({ exercises });
  },
  completeAllSets: (exerciseIdx) =>
    set((state) => {
      const newExercises = [...state.exercises];
      const exercise = newExercises[exerciseIdx];
      if (!exercise) return { exercises: newExercises };
      exercise.sets = exercise.sets.map((s) => {
        if (s.done) return s;
        let weight = s.weight;
        let reps = s.reps;
        if (!weight || !reps) {
          const prev = s.prev || "";
          const parts = prev.split("×").map((p) => p.trim());
          if (parts.length === 2) {
            const w = parts[0].replace(/[^0-9.]/g, "");
            const r = parts[1].replace(/[^0-9]/g, "");
            if (!weight) weight = w;
            if (!reps) reps = r;
          }
        }
        return { ...s, weight, reps, done: true };
      });
      return { exercises: newExercises };
    }),

  // Rest timer
  restActive: false,
  restSeconds: 0,
  restMax: 180,
  restExercise: "",
  startRest: (exerciseName, duration = 180) => {
    set({
      restActive: true,
      restSeconds: duration,
      restMax: duration,
      restExercise: exerciseName,
    });
  },
  tickRest: () => {
    const { restActive, restSeconds } = get();
    if (!restActive) return;
    if (restSeconds <= 1) {
      set({ restActive: false, restSeconds: 0 });
    } else {
      set({ restSeconds: restSeconds - 1 });
    }
  },
  skipRest: () => set({ restActive: false, restSeconds: 0 }),
}));
