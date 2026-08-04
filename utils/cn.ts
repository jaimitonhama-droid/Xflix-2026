// ============================================================
// XFLIX — Utils
// cn: Class Name Merger (Tailwind + clsx)
// ============================================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Usage: cn("base-class", condition && "conditional-class", "override")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
