// ============================================================
// XFLIX — Layout Component
// Container: max-width wrapper with responsive padding
// ============================================================

import { cn } from "@/utils/cn";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthStyles = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-screen-2xl",
  full: "max-w-full",
};

export function Container({
  maxWidth = "xl",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidthStyles[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
