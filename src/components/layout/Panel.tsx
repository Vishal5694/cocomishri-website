"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  side?: "left" | "right" | "top";
  triggerRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  className?: string;
  children: React.ReactNode;
  showDefaultCloseButton?: boolean;
}

export function Panel({
  isOpen,
  onClose,
  titleId,
  side = "right",
  triggerRef,
  className,
  children,
  showDefaultCloseButton = false,
}: PanelProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Focus trap, body scroll lock, Escape key, and focus return
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first focusable or panel
    const focusTimeout = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      } else if (panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          panelRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        const trigger = triggerRef && "current" in triggerRef ? triggerRef.current : triggerRef;
        trigger?.focus();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const trigger = triggerRef && "current" in triggerRef ? triggerRef.current : triggerRef;

    return () => {
      clearTimeout(focusTimeout);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const animationClasses = {
    left: "animate-in slide-in-from-left duration-300 ease-soft motion-reduce:animate-none",
    right: "animate-in slide-in-from-right duration-300 ease-soft motion-reduce:animate-none",
    top: "animate-in slide-in-from-top duration-300 ease-soft motion-reduce:animate-none",
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay: cocoa-900 at 40% opacity */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 bg-cocoa-900/40 transition-opacity duration-300 ease-soft motion-reduce:transition-none"
      />

      {/* Dialog container */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "bg-cream-50 text-cocoa-900 shadow-2xl relative z-50 focus:outline-none",
          animationClasses[side],
          className
        )}
      >
        {showDefaultCloseButton && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 absolute top-4 right-4 z-10"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
