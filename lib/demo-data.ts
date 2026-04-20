export const weeklyVolume = [12400, 0, 18200, 0, 15100, 22700, 10000];

export const weekTrendPercent = -2;

type DemoExercise = {
  id: number;
  name: string;
  equipment: "Barbell" | "Dumbbell" | "Machine" | "Cables" | "Bands" | "Bodyweight";
  muscleGroups: string[];
  sets: Array<{
    n: number;
    prev: string;
    weight: string;
    reps: string;
    done: boolean;
  }>;
};

export const DEMO_PUSH_DAY: DemoExercise[] = [
  {
    id: 0,
    name: "Bench Press",
    equipment: "Barbell",
    muscleGroups: ["Chest", "Triceps"],
    sets: [
      { n: 1, prev: "225 × 8", weight: "", reps: "", done: false },
      { n: 2, prev: "225 × 8", weight: "", reps: "", done: false },
      { n: 3, prev: "225 × 8", weight: "", reps: "", done: false },
      { n: 4, prev: "225 × 8", weight: "", reps: "", done: false },
    ],
  },
  {
    id: 1,
    name: "Overhead Press",
    equipment: "Barbell",
    muscleGroups: ["Shoulders", "Triceps"],
    sets: [
      { n: 1, prev: "135 × 6", weight: "", reps: "", done: false },
      { n: 2, prev: "135 × 6", weight: "", reps: "", done: false },
      { n: 3, prev: "135 × 6", weight: "", reps: "", done: false },
    ],
  },
  {
    id: 2,
    name: "Incline DB Press",
    equipment: "Dumbbell",
    muscleGroups: ["Chest", "Shoulders"],
    sets: [
      { n: 1, prev: "70s × 10", weight: "", reps: "", done: false },
      { n: 2, prev: "70s × 10", weight: "", reps: "", done: false },
      { n: 3, prev: "70s × 10", weight: "", reps: "", done: false },
    ],
  },
  {
    id: 3,
    name: "Lateral Raise",
    equipment: "Dumbbell",
    muscleGroups: ["Shoulders"],
    sets: [
      { n: 1, prev: "25s × 15", weight: "", reps: "", done: false },
      { n: 2, prev: "25s × 15", weight: "", reps: "", done: false },
      { n: 3, prev: "25s × 15", weight: "", reps: "", done: false },
    ],
  },
  {
    id: 4,
    name: "Tricep Pushdown",
    equipment: "Cables",
    muscleGroups: ["Triceps"],
    sets: [
      { n: 1, prev: "60 × 12", weight: "", reps: "", done: false },
      { n: 2, prev: "60 × 12", weight: "", reps: "", done: false },
      { n: 3, prev: "60 × 12", weight: "", reps: "", done: false },
    ],
  },
];

export const latestPR = {
  exercise: "Bench Press",
  weight: 225,
  reps: 8,
  daysAgo: 3,
  deltaVsPrev: 10,
};

export const friendsFeed = [
  {
    initials: "MR",
    name: "Marcus R",
    workout: "Push Day",
    volume: 24500,
    timeAgo: "2h",
  },
  {
    initials: "JK",
    name: "Jordan K",
    workout: "Pull Day",
    volume: 21200,
    timeAgo: "4h",
  },
  {
    initials: "AD",
    name: "Alex D",
    workout: "Leg Day",
    volume: 32100,
    timeAgo: "1d",
  },
];

export type MonthlyWorkoutEntry = {
  day: number;
  volume: number;
};

function buildMonth(daysInMonth: number, workouts: Record<number, number>) {
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    return { day, volume: workouts[day] ?? 0 };
  });
}

export const monthlyWorkoutData: Record<string, MonthlyWorkoutEntry[]> = {
  "2026-01": buildMonth(31, {
    2: 12600,
    4: 14200,
    6: 13800,
    9: 15100,
    11: 12900,
    13: 14500,
    16: 15800,
    18: 13400,
    20: 14900,
    23: 16300,
    25: 14100,
    27: 15200,
  }),
  "2026-02": buildMonth(28, {
    1: 13100,
    3: 14600,
    5: 13900,
    8: 15400,
    10: 13600,
    12: 14800,
    15: 16100,
    17: 14200,
    19: 15600,
    22: 14900,
    24: 16400,
    26: 14500,
  }),
  "2026-03": buildMonth(31, {
    2: 13200,
    4: 14800,
    6: 14100,
    9: 15500,
    11: 13600,
    13: 14900,
    16: 16200,
    18: 14300,
    20: 15800,
    23: 16700,
    25: 14600,
    27: 18500,
  }),
  "2026-04": buildMonth(30, {
    1: 18600,
    3: 20100,
    5: 19400,
    8: 20800,
    10: 19700,
    12: 18900,
    15: 22100,
    17: 21400,
    19: 23000,
    20: 14600,
  }),
};

function toMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

export function getMonthTotal(year: number, month: number) {
  const monthData = monthlyWorkoutData[toMonthKey(year, month)] ?? [];
  return monthData.reduce((sum, entry) => sum + entry.volume, 0);
}

export function getMonthOverMonthChange(year: number, month: number) {
  const currentTotal = getMonthTotal(year, month);
  const previousDate = new Date(year, month - 1, 1);
  const previousTotal = getMonthTotal(previousDate.getFullYear(), previousDate.getMonth());
  if (previousTotal === 0) {
    return 0;
  }
  return Math.round(((currentTotal - previousTotal) / previousTotal) * 100);
}

export type TemplateType = {
  id: string;
  name: string;
  muscleGroups: string[];
  estimatedDurationMin: number;
  exerciseCount: number;
};

export const DEMO_SPLIT = {
  id: "three-day-split",
  name: "3 Day Split",
  daysPerWeek: 3,
  structure: [
    { dayOfWeek: 1, templateId: "push-day" },
    { dayOfWeek: 3, templateId: "pull-day" },
    { dayOfWeek: 5, templateId: "leg-day" },
  ],
};

export const DEMO_TEMPLATES = {
  "push-day": {
    id: "push-day",
    name: "Push Day",
    muscleGroups: ["Chest", "Shoulders", "Triceps"],
    estimatedDurationMin: 60,
    exerciseCount: 5,
  },
  "pull-day": {
    id: "pull-day",
    name: "Pull Day",
    muscleGroups: ["Back", "Biceps"],
    estimatedDurationMin: 55,
    exerciseCount: 5,
  },
  "leg-day": {
    id: "leg-day",
    name: "Leg Day",
    muscleGroups: ["Quads", "Hamstrings", "Glutes"],
    estimatedDurationMin: 70,
    exerciseCount: 6,
  },
} as const satisfies Record<string, TemplateType>;

// Hardcoded completed sessions for this week (will be replaced by Supabase data in next prompt)
export const DEMO_COMPLETED_THIS_WEEK: Array<{
  dayOfWeek: number;
  templateName: string;
  totalVolumeLbs: number;
  durationMinutes: number;
  daysAgo: number;
}> = [];
