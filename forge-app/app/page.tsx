"use client";

import { StatusBar } from "@/components/StatusBar";
import { TabBar } from "@/components/TabBar";
import { RestTimerMini } from "@/components/RestTimerMini";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { WorkoutScreen } from "@/components/screens/WorkoutScreen";
import { LibraryScreen } from "@/components/screens/LibraryScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { useStore } from "@/lib/store";

export default function Page() {
  const tab = useStore((s) => s.tab);

  return (
    // Phone-sized container, centered on larger screens
    <main className="mx-auto max-w-md min-h-screen flex flex-col bg-bg">
      <StatusBar />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {tab === "home" && <HomeScreen />}
        {tab === "workout" && <WorkoutScreen />}
        {tab === "library" && <LibraryScreen />}
        {tab === "profile" && <ProfileScreen />}
      </div>

      <RestTimerMini />
      <TabBar />
    </main>
  );
}
