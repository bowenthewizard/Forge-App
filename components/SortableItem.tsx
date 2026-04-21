"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode, CSSProperties } from "react";

interface SortableItemProps {
  id: string;
  disabled?: boolean;
  children: (args: {
    setNodeRef: (el: HTMLElement | null) => void;
    style: CSSProperties;
    listeners: any;
    attributes: any;
    isDragging: boolean;
  }) => ReactNode;
}

export default function SortableItem({ id, disabled, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };
  return <>{children({ setNodeRef, style, listeners, attributes, isDragging })}</>;
}
