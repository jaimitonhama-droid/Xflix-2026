"use client";

// ============================================================
// XFLIX — UI Component
// Badge: category and status badges
// ============================================================

import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "outline"
  | "category";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46]",
  primary: "bg-[#DC2626]/20 text-[#EF4444] border border-[#DC2626]/30",
  success: "bg-green-900/20 text-green-400 border border-green-900/30",
  warning: "bg-yellow-900/20 text-yellow-400 border border-yellow-900/30",
  danger: "bg-red-900/20 text-red-400 border border-red-900/30",
  outline: "bg-transparent text-[#A1A1AA] border border-[#3F3F46]",
  category:
    "bg-[#18181B] text-[#A1A1AA] border border-[#27272A] hover:border-[#DC2626] hover:text-white transition-colors cursor-pointer",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
