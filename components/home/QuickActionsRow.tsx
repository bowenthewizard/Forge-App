"use client";

import { Plus, TrendingUp, Youtube } from "lucide-react";
import { useStore } from "@/lib/store";

export function QuickActionsRow() {
  const setTab = useStore((s) => s.setTab);

  return (
    <div className="flex items-start justify-around">
      <QuickAction icon={Plus} label="New Routine" color="#FFFFFF" />
      <QuickAction
        icon={Youtube}
        label="YT Import"
        color="#EF4444"
        onClick={() => setTab("library")}
      />
      <QuickAction
        icon={TrendingUp}
        label="Progress"
        color="#10B981"
        onClick={() => setTab("profile")}
      />
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  color,
  onClick,
}: {
  icon: typeof Plus;
  label: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div className="w-10 h-10 rounded-full bg-surface hover:bg-[#222222] transition-colors flex items-center justify-center">
        <Icon size={18} style={{ color }} strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium text-text-secondary">{label}</span>
    </button>
  );
}
