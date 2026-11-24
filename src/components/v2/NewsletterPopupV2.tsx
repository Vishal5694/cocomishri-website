"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { asset } from "@/lib/asset";

const STORAGE_KEY = "cm_v2_popup_seen";

export function NewsletterPopupV2() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  const markSeen = React.useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleClose = React.useCallback(() => {
    markSeen();
    setIsOpen(false);
  }, [markSeen]);

  React.useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.5) {
        markSeen();
        setIsOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [markSeen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setIsSubscribed(true);
    setEmail("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-cocoa-900/50 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Outer 12px diagonal-stripe border (blush-100 / cream-50) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="v2-popup-heading"
        className="relative z-10 w-full max-w-md rounded-card p-3 shadow-2xl"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--color-blush-100), var(--color-blush-100) 12px, var(--color-cream-50) 12px, var(--color-cream-50) 24px)",
        }}
      >
        <div className="relative bg-cream-50 rounded-[12px] p-6 sm:p-8 text-center">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-2 right-2 size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col items-center space-y-4 pt-2">
            <img
              src={asset("/brand/mascot.svg")}
              alt="Cocomishri mascot"
              width={72}
              height={72}
              className="size-[72px] object-contain"
            />

            <span className="eyebrow">Join our little world</span>

            <h2
              id="v2-popup-heading"
              className="font-heading text-[26px] leading-[1.25] font-medium text-cocoa-900"
            >
              Be the first to know about new pieces.
            </h2>

            {isSubscribed ? (
              <div className="w-full bg-sand-100 border border-sand-300 rounded-card p-4 text-sm text-cocoa-900">
                Thank you for joining our little world. We&apos;ll be in touch soon.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-3 text-left pt-1"
                noValidate
              >
                <Input
                  type="email"
                  label="Email address"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  error={emailError}
                />
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Sign me up
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
