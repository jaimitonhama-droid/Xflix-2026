"use client";

// ============================================================
// XFLIX — UI Component
// Input: dark-themed input with label, error, and icon support
// ============================================================

import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full")}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#D4D4D8]"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[#71717A] pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              // Base
              "w-full rounded-lg text-sm",
              "bg-[#18181B] text-[#FAFAFA] placeholder:text-[#52525B]",
              "border border-[#27272A]",
              "h-10 px-3",
              // Focus
              "focus:outline-none focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/30",
              // Transition
              "transition-colors duration-200",
              // Icon padding
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              // Error state
              error &&
                "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 text-[#71717A]">{rightIcon}</span>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}

        {helper && !error && (
          <p className="text-xs text-[#71717A]">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
