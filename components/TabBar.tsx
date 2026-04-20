"use client";

import { Home, Dumbbell, BookOpen, User } from "lucide-react";
import { useStore, type Tab } from "@/lib/store";
import clsx from "clsx";

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "workout", label: "Workout", Icon: Dumbbell },
  { id: "library", label: "Library", Icon: BookOpen },
  { id: "profile", label: "Profile", Icon: User },
];

export function TabBar() {
  const tab = useStore((s) => s.tab);
  const setTab = useStore((s) => s.setTab);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex w-full max-w-full flex-col border-t border-[#1F1F1F]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex h-[72px] flex-shrink-0 items-start pt-2.5">
      {TABS.map(({ id, label, Icon }) => {
        const active =
          id === "workout"
            ? tab === "workout" || tab === "workout-logging"
            : tab === id;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
          >
            <Icon
              size={22}
              strokeWidth={1.8}
              className={clsx(active ? "text-white" : "text-text-tertiary")}
            />
            <span
              className={clsx(
                "text-[10px] font-semibold",
                active ? "text-white" : "text-text-tertiary"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
      </div>
    </nav>
  );
}
