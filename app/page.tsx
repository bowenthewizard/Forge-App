"use client";

import { StatusBar } from "@/components/StatusBar";
import { TabBar } from "@/components/TabBar";
import { RestTimerMini } from "@/components/RestTimerMini";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { WorkoutScreen } from "@/components/screens/WorkoutScreen";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { PostWorkoutSummaryScreen } from "@/components/screens/PostWorkoutSummaryScreen";
import { useStore } from "@/lib/store";

export default function Page() {
  const tab = useStore((s) => s.tab);

  return (
    // Phone-sized container, centered on larger screens
    <main className="mx-auto flex w-full max-w-md min-h-screen flex-col overflow-x-hidden bg-bg">
      <StatusBar />

      <div
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{
          paddingBottom: "calc(76px + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {tab === "home" && <HomeScreen />}
        {(tab === "workout" || tab === "workout-logging") && <WorkoutScreen />}
        {tab === "library" && <LibraryScreen />}
        {tab === "profile" && <ProfileScreen />}
        {tab === "summary" && <PostWorkoutSummaryScreen />}
      </div>

      <RestTimerMini />
      {tab !== "summary" && <TabBar />}
    </main>
  );
}
