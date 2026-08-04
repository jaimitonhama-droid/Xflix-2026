// ============================================================
// XFLIX — Layout Component
// Section: vertical spacing wrapper for page sections
// ============================================================

import { cn } from "@/utils/cn";
import { Container } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article" | "main";
  spacing?: "sm" | "md" | "lg" | "xl";
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const spacingStyles = {
  sm: "py-6",
  md: "py-10 md:py-12",
  lg: "py-12 md:py-16",
  xl: "py-16 md:py-24",
};

export function Section({
  as: Tag = "section",
  spacing = "md",
  title,
  subtitle,
  action,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag className={cn(spacingStyles[spacing], className)} {...props}>
      <Container>
        {(title || subtitle || action) && (
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              {title && (
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs md:text-sm text-[#71717A] mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </Tag>
  );
}
