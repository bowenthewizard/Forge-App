import { supabase } from "@/lib/supabase";

// Module-level caches (persist across re-renders / React Strict Mode double-invocations)
const alreadySeeded = new Set<string>();

export async function ensureUserLibrarySeeded(userId: string): Promise<void> {
  if (!userId) return;
  if (alreadySeeded.has(userId)) return;
  await runSeed(userId);
  alreadySeeded.add(userId);
}

async function runSeed(userId: string): Promise<void> {
  try {
    // Check if user already has routines
    const { count, error: countError } = await supabase
      .from("routines")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Library seed: count query failed:", countError);
      return;
    }

    if ((count ?? 0) > 0) {
      alreadySeeded.add(userId);
      return;
    }

    // Fetch starter templates
    const { data: templates, error: templatesError } = await supabase
      .from("routine_templates")
      .select("*")
      .eq("is_starter", true);

    if (templatesError) {
      console.error("Library seed: fetch templates failed:", templatesError);
      return;
    }

    if (!templates || templates.length === 0) {
      console.warn("Library seed: no starter templates found. Skipping seed.");
      alreadySeeded.add(userId);
      return;
    }

    // Build rows to insert
    const rows = templates.map((t) => ({
      user_id: userId,
      name: t.name,
      description: t.description,
      category: t.category,
      difficulty: t.difficulty,
      estimated_duration_minutes: t.estimated_duration_minutes,
      exercises: t.exercises,
      source: "template_copy",
      source_template_id: t.id,
    }));

    const { error: insertError } = await supabase
      .from("routines")
      .upsert(rows, {
        onConflict: "user_id,source_template_id",
        ignoreDuplicates: true,
      });

    if (insertError) {
      console.error("Library seed: insert failed:", insertError);
      return;
    }

    alreadySeeded.add(userId);
    console.log(`Library seed: inserted ${rows.length} starter routines for ${userId}`);

    // Sanity check: if there are more rows than templates, something went wrong (race condition, etc.)
    const { count: finalCount } = await supabase
      .from("routines")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (finalCount && finalCount > templates.length) {
      console.warn(
        `Library seed: user has ${finalCount} routines but only ${templates.length} templates exist. Possible duplicate seeding.`
      );
    }
  } catch (err) {
    console.error("Library seed: unexpected error:", err);
  }
}
