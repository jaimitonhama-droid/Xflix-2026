"use client";

// ============================================================
// XFLIX — UI Component
// EmptyState: empty content placeholder with icon and CTA
// ============================================================

import { cn } from "@/utils/cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "text-center py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="mb-4 p-4 rounded-full bg-[#18181B] border border-[#27272A] text-[#52525B]">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-[#A1A1AA] max-w-sm mb-6">{description}</p>
      )}

      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
