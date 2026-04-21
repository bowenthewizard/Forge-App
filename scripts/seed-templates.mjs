import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROUTINES = [
  {
    name: "StrongLifts A",
    category: "full_body",
    difficulty: "beginner",
    estimated_duration_minutes: 45,
    exercises: [
      { name: "Barbell Full Squat", sets: 5, reps: "5", rest_seconds: 180 },
      { name: "Barbell Bench Press - Medium Grip", sets: 5, reps: "5", rest_seconds: 180 },
      { name: "Bent Over Barbell Row", sets: 5, reps: "5", rest_seconds: 180 },
    ],
  },
  {
    name: "StrongLifts B",
    category: "full_body",
    difficulty: "beginner",
    estimated_duration_minutes: 45,
    exercises: [
      { name: "Barbell Full Squat", sets: 5, reps: "5", rest_seconds: 180 },
      { name: "Standing Military Press", sets: 5, reps: "5", rest_seconds: 180 },
      { name: "Barbell Deadlift", sets: 1, reps: "5", rest_seconds: 300 },
    ],
  },
  {
    name: "Classic Push (PPL)",
    category: "push",
    difficulty: "intermediate",
    estimated_duration_minutes: 60,
    exercises: [
      { name: "Barbell Bench Press - Medium Grip", sets: 4, reps: "6-8", rest_seconds: 180 },
      { name: "Standing Military Press", sets: 3, reps: "6-8", rest_seconds: 150 },
      { name: "Incline Dumbbell Press", sets: 3, reps: "8-12", rest_seconds: 120 },
      { name: "Side Lateral Raise", sets: 3, reps: "10-12", rest_seconds: 90 },
      { name: "Triceps Pushdown", sets: 3, reps: "10-12", rest_seconds: 90 },
      { name: "Tricep Dumbbell Kickback", sets: 3, reps: "10-12", rest_seconds: 90 },
    ],
  },
  {
    name: "Classic Pull (PPL)",
    category: "pull",
    difficulty: "intermediate",
    estimated_duration_minutes: 60,
    exercises: [
      { name: "Barbell Deadlift", sets: 4, reps: "5", rest_seconds: 180 },
      { name: "Pullups", sets: 3, reps: "8-12", rest_seconds: 150 },
      { name: "Bent Over Barbell Row", sets: 4, reps: "6-8", rest_seconds: 150 },
      { name: "Seated Cable Rows", sets: 3, reps: "8-12", rest_seconds: 90 },
      { name: "Face Pull", sets: 3, reps: "12-15", rest_seconds: 60 },
      { name: "Barbell Curl", sets: 3, reps: "8-12", rest_seconds: 90 },
    ],
  },
  {
    name: "Classic Legs (PPL)",
    category: "legs",
    difficulty: "intermediate",
    estimated_duration_minutes: 70,
    exercises: [
      { name: "Barbell Full Squat", sets: 4, reps: "6-8", rest_seconds: 180 },
      { name: "Romanian Deadlift", sets: 3, reps: "8-10", rest_seconds: 150 },
      { name: "Leg Press", sets: 3, reps: "10-12", rest_seconds: 120 },
      { name: "Seated Leg Curl", sets: 3, reps: "10-12", rest_seconds: 90 },
      { name: "Standing Calf Raises", sets: 4, reps: "10-15", rest_seconds: 60 },
    ],
  },
  {
    name: "5/3/1 Upper",
    category: "upper",
    difficulty: "intermediate",
    estimated_duration_minutes: 55,
    exercises: [
      {
        name: "Barbell Bench Press - Medium Grip",
        sets: 3,
        reps: "5",
        rest_seconds: 180,
        notes: "Heavy working set (80-90% 1RM)",
      },
      {
        name: "Barbell Bench Press - Medium Grip",
        sets: 5,
        reps: "10",
        rest_seconds: 90,
        notes: "BBB volume set (50-60% 1RM)",
      },
      { name: "Bent Over Two-Dumbbell Row", sets: 5, reps: "10", rest_seconds: 90 },
      { name: "Face Pull", sets: 3, reps: "15", rest_seconds: 60 },
    ],
  },
  {
    name: "5/3/1 Lower",
    category: "lower",
    difficulty: "intermediate",
    estimated_duration_minutes: 60,
    exercises: [
      {
        name: "Barbell Full Squat",
        sets: 3,
        reps: "5",
        rest_seconds: 180,
        notes: "Heavy working set (80-90% 1RM)",
      },
      {
        name: "Barbell Full Squat",
        sets: 5,
        reps: "10",
        rest_seconds: 90,
        notes: "BBB volume set (50-60% 1RM)",
      },
      { name: "Romanian Deadlift", sets: 5, reps: "10", rest_seconds: 90 },
      { name: "Standing Calf Raises", sets: 3, reps: "15", rest_seconds: 60 },
    ],
  },
  {
    name: "Core Circuit",
    category: "core",
    difficulty: "beginner",
    estimated_duration_minutes: 20,
    exercises: [
      { name: "Plank", sets: 3, reps: "45s", rest_seconds: 45 },
      { name: "Cross-Body Crunch", sets: 3, reps: "20", rest_seconds: 45 },
      { name: "Russian Twist", sets: 3, reps: "20", rest_seconds: 45 },
      { name: "Hanging Leg Raise", sets: 3, reps: "12", rest_seconds: 45 },
    ],
  },
];

const EXERCISE_PAIR_REGEX = /id:\s*"([^"]+)",\s*\n\s*name:\s*"([^"]+)"/g;

function escapeSqlString(value) {
  return String(value).replaceAll("'", "''");
}

function levenshteinDistance(a, b) {
  const s = a.toLowerCase();
  const t = b.toLowerCase();
  const rows = s.length + 1;
  const cols = t.length + 1;
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) dp[i][0] = i;
  for (let j = 0; j < cols; j += 1) dp[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[s.length][t.length];
}

function topClosestMatches(targetName, nameToIdMap, limit = 3) {
  const candidates = [];
  for (const [name, id] of nameToIdMap.entries()) {
    candidates.push({
      name,
      id,
      distance: levenshteinDistance(targetName, name),
    });
  }

  candidates.sort((a, b) => {
    if (a.distance !== b.distance) return a.distance - b.distance;
    return a.name.localeCompare(b.name);
  });

  return candidates.slice(0, limit);
}

async function buildNameToIdMap(exercisesTsPath) {
  const raw = await readFile(exercisesTsPath, "utf8");
  const map = new Map();
  let match;

  while ((match = EXERCISE_PAIR_REGEX.exec(raw)) !== null) {
    const [, id, name] = match;
    map.set(name.toLowerCase().trim(), id);
  }

  return map;
}

function buildInsertSql(routine, resolvedExercises) {
  const exerciseJson = JSON.stringify(resolvedExercises).replaceAll("'", "''");

  return `INSERT INTO public.routine_templates (name, description, category, difficulty, estimated_duration_minutes, exercises, is_starter)
VALUES (
  '${escapeSqlString(routine.name)}',
  NULL,
  '${escapeSqlString(routine.category)}',
  '${escapeSqlString(routine.difficulty)}',
  ${routine.estimated_duration_minutes},
  '${exerciseJson}'::jsonb,
  true
);`;
}

async function main() {
  const root = process.cwd();
  const exercisesTsPath = path.resolve(root, "lib/data/exercises.ts");
  const sqlOutPath = path.resolve(root, "scripts/seed-templates.sql");

  const nameToId = await buildNameToIdMap(exercisesTsPath);
  if (nameToId.size === 0) {
    console.error("Failed to parse any exercise id/name pairs from lib/data/exercises.ts");
    process.exit(1);
  }

  console.log("Resolving exercises against lib/data/exercises.ts...");

  const failures = [];
  const resolvedRoutines = [];
  let totalResolvedExercises = 0;

  for (const routine of ROUTINES) {
    const unresolved = [];
    const resolvedExercises = [];

    routine.exercises.forEach((exercise, index) => {
      const lookupKey = exercise.name.toLowerCase().trim();
      const exerciseId = nameToId.get(lookupKey);

      if (!exerciseId) {
        unresolved.push({
          name: exercise.name,
          suggestions: topClosestMatches(lookupKey, nameToId, 3),
        });
        return;
      }

      const payload = {
        exercise_id: exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest_seconds,
        order: index,
      };

      if (exercise.notes) {
        payload.notes = exercise.notes;
      }

      resolvedExercises.push(payload);
    });

    if (unresolved.length > 0) {
      failures.push({ routineName: routine.name, unresolved });
      continue;
    }

    resolvedRoutines.push({
      routine,
      resolvedExercises,
    });
    totalResolvedExercises += resolvedExercises.length;
    console.log(
      `✓ ${routine.name} (${resolvedExercises.length}/${routine.exercises.length} exercises resolved)`
    );
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`✗ ${failure.routineName}: ${failure.unresolved.length} unresolved`);
      for (const item of failure.unresolved) {
        console.error(`    "${item.name}" — no match`);
        console.error("    Closest matches:");
        for (const suggestion of item.suggestions) {
          console.error(`      - "${suggestion.name}" -> ${suggestion.id}`);
        }
      }
    }
    process.exit(1);
  }

  const sqlChunks = [
    "-- Auto-generated by scripts/seed-templates.mjs",
    "-- Paste into Supabase SQL Editor and run.",
    "-- Safe to re-run: DELETEs existing is_starter=true rows first.",
    "",
    "DELETE FROM public.routine_templates WHERE is_starter = true;",
    "",
  ];

  for (const { routine, resolvedExercises } of resolvedRoutines) {
    sqlChunks.push(buildInsertSql(routine, resolvedExercises), "");
  }

  const sqlOutput = `${sqlChunks.join("\n").trimEnd()}\n`;
  await writeFile(sqlOutPath, sqlOutput, "utf8");
  console.log(
    `✓ Wrote scripts/seed-templates.sql (${resolvedRoutines.length} routines, ${totalResolvedExercises} exercises total)`
  );
}

main().catch((error) => {
  console.error("Unexpected error while generating seed templates SQL.");
  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});
