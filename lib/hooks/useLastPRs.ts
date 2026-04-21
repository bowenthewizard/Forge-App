"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type LastPR = {
  weight: number;
  reps: number;
  logged_at: string;
};

/**
 * Given a list of exercise_ids, fetch each one's best recorded set
 * (highest weight, tiebreaker: highest reps) for the current user.
 *
 * Returns a map of exercise_id -> LastPR | null.
 * Returns empty map while loading or on error.
 */
export function useLastPRs(userId: string, exerciseIds: string[]): {
  prs: Map<string, LastPR>;
  isLoading: boolean;
} {
  const [prs, setPrs] = useState<Map<string, LastPR>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  // Stable key for the effect dependency (order-insensitive)
  const exerciseKey = [...exerciseIds].sort().join(",");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!userId || exerciseIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        // Get this user's session ids
        const { data: sessions, error: sessionsError } = await supabase
          .from("workout_sessions")
          .select("id")
          .eq("user_id", userId);

        if (sessionsError) {
          console.error("useLastPRs: sessions fetch failed:", sessionsError);
          if (!cancelled) setIsLoading(false);
          return;
        }

        const sessionIds = (sessions ?? []).map((s: { id: string }) => s.id);
        if (sessionIds.length === 0) {
          if (!cancelled) {
            setPrs(new Map());
            setIsLoading(false);
          }
          return;
        }

        // Get all completed sets in those sessions matching our exercise ids
        const { data: sets, error: setsError } = await supabase
          .from("workout_sets")
          .select("exercise_id, weight, reps, workout_session_id")
          .in("workout_session_id", sessionIds)
          .in("exercise_id", exerciseIds)
          .eq("completed", true);

        if (setsError) {
          console.error("useLastPRs: sets fetch failed:", setsError);
          if (!cancelled) setIsLoading(false);
          return;
        }

        // Reduce to best set per exercise_id
        const best = new Map<string, LastPR>();
        (sets ?? []).forEach((s: any) => {
          if (!s.exercise_id || s.weight == null || s.reps == null) return;
          const existing = best.get(s.exercise_id);
          const isBetter =
            !existing ||
            s.weight > existing.weight ||
            (s.weight === existing.weight && s.reps > existing.reps);
          if (isBetter) {
            best.set(s.exercise_id, {
              weight: s.weight,
              reps: s.reps,
              logged_at: "",
            });
          }
        });

        if (!cancelled) {
          setPrs(best);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("useLastPRs: unexpected error:", err);
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId, exerciseKey]);

  return { prs, isLoading };
}
