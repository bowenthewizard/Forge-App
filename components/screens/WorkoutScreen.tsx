"use client";

import WorkoutTabDashboard from "@/components/workout/WorkoutTabDashboard";
import { WorkoutLoggingScreen } from "./WorkoutLoggingScreen";
import { useStore } from "@/lib/store";

export function WorkoutScreen() {
  const tab = useStore((s) => s.tab);

  if (tab === "workout-logging") {
    return <WorkoutLoggingScreen />;
  }

  return <WorkoutTabDashboard />;
}
