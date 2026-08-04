"use client";

// ============================================================
// XFLIX — UI Component
// Loading: spinner and skeleton loaders
// ============================================================

import { cn } from "@/utils/cn";

// ── Spinner ──────────────────────────────────────────────────
export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const spinnerSizes = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-3",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="A carregar..."
      className={cn(
        "rounded-full border-[#27272A] border-t-[#DC2626] animate-spin",
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ── Full Page Loading ─────────────────────────────────────────
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-[#71717A] text-sm animate-pulse">A carregar...</p>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rect" | "circle";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  variant = "rect",
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md",
        variant === "circle" && "rounded-full",
        variant === "text" && "rounded h-4",
        className
      )}
      style={{
        width: width,
        height: height || (variant === "text" ? undefined : height),
        ...style,
      }}
      {...props}
    />
  );
}

// ── Video Card Skeleton ───────────────────────────────────────
export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-full aspect-video" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2 h-3" />
      </div>
    </div>
  );
}

// ── Video Row Skeleton ────────────────────────────────────────
export function VideoRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-64">
          <VideoCardSkeleton />
        </div>
      ))}
    </div>
  );
}
