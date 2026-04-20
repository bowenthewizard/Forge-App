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
      className="flex-shrink-0 flex items-start pt-2.5 h-[72px] border-t border-white/[0.07]"
      style={{
        // Glass treatment — per design spec
        backgroundColor: "rgba(8, 8, 8, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id;
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
    </nav>
  );
}
