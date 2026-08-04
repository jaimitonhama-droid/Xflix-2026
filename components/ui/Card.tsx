"use client";

// ============================================================
// XFLIX — UI Component
// Card: versatile card with variants and hover effects
// ============================================================

import { cn } from "@/utils/cn";

export type CardVariant = "default" | "hover" | "featured" | "glass";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: "none" | "sm" | "md" | "lg";
  noBorder?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-[#18181B] border border-[#27272A]",
  hover:
    "bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 transition-all duration-250",
  featured:
    "bg-gradient-to-br from-[#1A0505] to-[#18181B] border border-[#DC2626]/20 shadow-lg shadow-red-950/20",
  glass:
    "bg-[#18181B]/80 backdrop-blur-md border border-[#27272A]/60",
};

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  variant = "default",
  padding = "md",
  noBorder = false,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden",
        variantStyles[variant],
        paddingStyles[padding],
        noBorder && "border-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-[#27272A]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
