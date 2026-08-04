"use client";

// ============================================================
// XFLIX — UI Component
// Button: versatile button with variants, sizes, and loading
// ============================================================

import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "gradient";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#DC2626] hover:bg-[#B91C1C] text-white shadow-lg shadow-red-900/30 hover:shadow-red-900/50",
  secondary:
    "bg-[#27272A] hover:bg-[#3F3F46] text-white border border-[#3F3F46] hover:border-[#52525B]",
  ghost:
    "bg-transparent hover:bg-[#27272A] text-[#A1A1AA] hover:text-white",
  outline:
    "bg-transparent border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white",
  danger:
    "bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30",
  gradient:
    "bg-gradient-to-r from-[#DC2626] to-[#7F1D1D] hover:from-[#B91C1C] hover:to-[#6B1212] text-white shadow-lg shadow-red-900/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2.5",
  icon: "h-10 w-10 p-0",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "font-medium rounded-lg",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]",
          "select-none cursor-pointer",
          "active:scale-[0.98]",
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // States
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : 16} />
        ) : (
          leftIcon
        )}
        {children && (
          <span className={size === "icon" ? "sr-only" : undefined}>
            {children}
          </span>
        )}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
