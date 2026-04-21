import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

/** @typedef {"chest"|"back"|"shoulders"|"biceps"|"triceps"|"forearms"|"quads"|"hamstrings"|"glutes"|"calves"|"core"} MuscleGroup */
/** @typedef {"barbell"|"dumbbell"|"machine"|"cable"|"bodyweight"|"band"|"kettlebell"} Equipment */
/** @typedef {"compound"|"isolation"} Category */
/** @typedef {"beginner"|"intermediate"|"advanced"} Difficulty */

/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} name
 * @property {MuscleGroup} primary_muscle
 * @property {MuscleGroup[]} secondary_muscles
 * @property {Equipment} equipment
 * @property {Category} category
 * @property {Difficulty} difficulty
 * @property {string[]} form_tips
 * @property {string[]} image_urls
 */

/** @type {Record<string, MuscleGroup | null>} */
const MUSCLE_MAP = {
  biceps: "biceps",
  chest: "chest",
  abdominals: "core",
  calves: "calves",
  forearms: "forearms",
  glutes: "glutes",
  hamstrings: "hamstrings",
  lats: "back",
  "lower back": "back",
  "middle back": "back",
  traps: "back",
  quadriceps: "quads",
  shoulders: "shoulders",
  triceps: "triceps",
  neck: null,
  adductors: null,
  abductors: null,
};

/** @type {Record<string, Equipment | null>} */
const EQUIPMENT_MAP = {
  barbell: "barbell",
  dumbbell: "dumbbell",
  machine: "machine",
  cable: "cable",
  "body only": "bodyweight",
  bands: "band",
  kettlebells: "kettlebell",
  "e-z curl bar": "barbell",
  "exercise ball": "bodyweight",
  "medicine ball": "bodyweight",
  "foam roll": null,
  other: null,
};

const MUSCLE_ORDER = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "forearms",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "core",
];

/** @param {unknown} value */
function normalizeKey(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/** @param {unknown} value */
function mapMuscle(value) {
  const key = normalizeKey(value);
  return Object.prototype.hasOwnProperty.call(MUSCLE_MAP, key) ? MUSCLE_MAP[key] : null;
}

/** @param {unknown} value */
function mapEquipment(value) {
  const key = normalizeKey(value);
  if (!key) {
    return null;
  }
  return Object.prototype.hasOwnProperty.call(EQUIPMENT_MAP, key) ? EQUIPMENT_MAP[key] : null;
}

/** @param {unknown} mechanic */
function mapCategory(mechanic) {
  const key = normalizeKey(mechanic);
  if (key === "isolation") return "isolation";
  return "compound";
}

/** @param {unknown} level */
function mapDifficulty(level) {
  const key = normalizeKey(level);
  if (key === "beginner") return "beginner";
  if (key === "intermediate") return "intermediate";
  if (key === "expert") return "advanced";
  return "intermediate";
}

/** @param {string} text */
function truncateTip(text) {
  if (text.length <= 200) return text;
  return `${text.slice(0, 197)}...`;
}

/** @param {unknown} value */
function toStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

/** @param {string[]} values */
function renderStringArray(values) {
  if (values.length === 0) {
    return "[]";
  }
  return `[\n${values.map((value) => `      ${JSON.stringify(value)}`).join(",\n")}\n    ]`;
}

/** @param {Exercise} exercise */
function renderExercise(exercise) {
  return [
    "  {",
    `    id: ${JSON.stringify(exercise.id)},`,
    `    name: ${JSON.stringify(exercise.name)},`,
    `    primary_muscle: ${JSON.stringify(exercise.primary_muscle)},`,
    `    secondary_muscles: ${renderStringArray(exercise.secondary_muscles)},`,
    `    equipment: ${JSON.stringify(exercise.equipment)},`,
    `    category: ${JSON.stringify(exercise.category)},`,
    `    difficulty: ${JSON.stringify(exercise.difficulty)},`,
    `    form_tips: ${renderStringArray(exercise.form_tips)},`,
    `    image_urls: ${renderStringArray(exercise.image_urls)},`,
    "  }",
  ].join("\n");
}

/** @param {Record<string, number>} dist */
function formatDistribution(dist) {
  return MUSCLE_ORDER.map((muscle) => `${muscle}: ${dist[muscle] ?? 0}`).join("   ");
}

function logSummary(prefix, summary, distribution) {
  console.log(`${prefix}`);
  console.log(`  Total fetched: ${summary.totalFetched}`);
  console.log(`  Total kept:    ${summary.totalKept}`);
  console.log(`  Total skipped: ${summary.totalSkipped}`);
  console.log(`    - Non-strength: ${summary.nonStrength}`);
  console.log(`    - Unmapped muscle: ${summary.unmappedMuscle}`);
  console.log(`    - Unmapped equipment: ${summary.unmappedEquipment}`);
  console.log(`    - Other: ${summary.other}`);
  console.log("  Distribution:");
  console.log(`    ${formatDistribution(distribution)}`);
}

async function main() {
  /** @type {Exercise[]} */
  const kept = [];
  /** @type {Record<string, number>} */
  const distribution = Object.fromEntries(MUSCLE_ORDER.map((name) => [name, 0]));
  const skipped = {
    nonStrength: 0,
    unmappedMuscle: 0,
    unmappedEquipment: 0,
    other: 0,
  };

  let sourceData;
  try {
    const response = await fetch(SOURCE_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    sourceData = await response.json();
  } catch (error) {
    console.error("Failed to fetch exercise dataset.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!Array.isArray(sourceData)) {
    console.error("Fetched dataset is not an array; aborting.");
    process.exit(1);
  }

  for (const item of sourceData) {
    try {
      if (!item || typeof item !== "object") {
        skipped.other += 1;
        continue;
      }

      if (item.category !== "strength") {
        skipped.nonStrength += 1;
        continue;
      }

      const primaryList = Array.isArray(item.primaryMuscles) ? item.primaryMuscles : [];
      const mappedPrimary = primaryList.length > 0 ? mapMuscle(primaryList[0]) : null;
      if (!mappedPrimary) {
        skipped.unmappedMuscle += 1;
        continue;
      }

      const mappedEquipment = mapEquipment(item.equipment);
      if (!mappedEquipment) {
        skipped.unmappedEquipment += 1;
        continue;
      }

      const rawId = typeof item.id === "string" ? item.id : "";
      const id = rawId.toLowerCase().replaceAll("_", "-").trim();
      if (!id) {
        skipped.other += 1;
        continue;
      }

      const secondary = toStringArray(item.secondaryMuscles)
        .map((muscle) => mapMuscle(muscle))
        .filter((muscle) => Boolean(muscle));

      const formTips = toStringArray(item.instructions)
        .slice(0, 3)
        .map((tip) => truncateTip(tip));

      const imageUrls = toStringArray(item.images).map((img) => `${IMAGE_BASE_URL}${img}`);

      /** @type {Exercise} */
      const transformed = {
        id,
        name: typeof item.name === "string" ? item.name : id,
        primary_muscle: mappedPrimary,
        secondary_muscles: /** @type {MuscleGroup[]} */ (secondary),
        equipment: mappedEquipment,
        category: mapCategory(item.mechanic),
        difficulty: mapDifficulty(item.level),
        form_tips: formTips,
        image_urls: imageUrls,
      };

      kept.push(transformed);
      distribution[transformed.primary_muscle] += 1;
    } catch {
      skipped.other += 1;
    }
  }

  if (kept.length === 0) {
    console.error("No exercises survived transform; aborting without writing output.");
    process.exit(1);
  }

  const summary = {
    totalFetched: sourceData.length,
    totalKept: kept.length,
    totalSkipped:
      skipped.nonStrength + skipped.unmappedMuscle + skipped.unmappedEquipment + skipped.other,
    nonStrength: skipped.nonStrength,
    unmappedMuscle: skipped.unmappedMuscle,
    unmappedEquipment: skipped.unmappedEquipment,
    other: skipped.other,
  };

  const header = `// Auto-generated by scripts/fetch-exercises.mjs
// Source: github.com/yuhonas/free-exercise-db (public domain)
// Do not edit manually — re-run the script to regenerate.

export type MuscleGroup =
  | "chest" | "back" | "shoulders"
  | "biceps" | "triceps" | "forearms"
  | "quads" | "hamstrings" | "glutes" | "calves"
  | "core";

export type Equipment =
  | "barbell" | "dumbbell" | "machine"
  | "cable" | "bodyweight" | "band" | "kettlebell";

export interface Exercise {
  id: string;
  name: string;
  primary_muscle: MuscleGroup;
  secondary_muscles: MuscleGroup[];
  equipment: Equipment;
  category: "compound" | "isolation";
  difficulty: "beginner" | "intermediate" | "advanced";
  form_tips: string[];
  image_urls: string[];
}

export const EXERCISES: Exercise[] = [
`;

  const body = kept.map((exercise) => renderExercise(exercise)).join(",\n");
  const output = `${header}${body}\n];\n`;

  logSummary("Summary before write:", summary, distribution);

  const outputPath = path.resolve(process.cwd(), "lib/data/exercises.ts");
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, output, "utf8");

  console.log("✓ Wrote lib/data/exercises.ts");
  console.log(`  Total fetched: ${summary.totalFetched}`);
  console.log(`  Total kept:    ${summary.totalKept}`);
  console.log(`  Total skipped: ${summary.totalSkipped}`);
  console.log(`    - Non-strength: ${summary.nonStrength}`);
  console.log(`    - Unmapped muscle: ${summary.unmappedMuscle}`);
  console.log(`    - Unmapped equipment: ${summary.unmappedEquipment}`);
  console.log(`    - Other: ${summary.other}`);
  console.log("  Distribution:");
  console.log(`    ${formatDistribution(distribution)}`);
}

main().catch((error) => {
  console.error("Unexpected failure while generating exercise data.");
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
