"use client";

// ============================================================
// XFLIX — UI Component
// Modal: accessible modal with portal, overlay, and animations
// ============================================================

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-full m-4",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlay = true,
  children,
  footer,
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      onClick={handleOverlayClick}
      className={cn(
        "fixed inset-0 z-50",
        "flex items-center justify-center p-4",
        "bg-black/70 backdrop-blur-sm",
        "animate-fade-in"
      )}
    >
      <div
        className={cn(
          "relative w-full",
          "bg-[#18181B] border border-[#27272A]",
          "rounded-2xl shadow-2xl shadow-black/50",
          "flex flex-col",
          "max-h-[90vh]",
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-6 border-b border-[#27272A]">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-white"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-[#A1A1AA] mt-1">{description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Fechar modal"
              className="ml-4 flex-shrink-0"
            >
              <X size={18} />
            </Button>
          </div>
        )}

        {/* Close button (when no title) */}
        {!title && !description && (
          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#27272A] transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-6 pt-0 border-t border-[#27272A]">{footer}</div>
        )}
      </div>
    </div>,
    document.body
  );
}
