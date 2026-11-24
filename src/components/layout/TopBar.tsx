"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function TopBar() {
  const messages = siteConfig.announcements;
  const [index, setIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const switchTo = React.useCallback(
    (nextIndex: number) => {
      if (reducedMotion) {
        setIndex(nextIndex);
        return;
      }
      setVisible(false);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        setIndex(nextIndex);
        setVisible(true);
        timerRef.current = null;
      }, 150);
    },
    [reducedMotion]
  );

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  React.useEffect(() => {
    if (reducedMotion || isPaused || messages.length <= 1) return;
    const id = window.setInterval(() => {
      switchTo((index + 1) % messages.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [reducedMotion, isPaused, messages.length, index, switchTo]);

  if (messages.length === 0) return null;

  const displayIndex = reducedMotion ? 0 : index;

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="fixed top-0 left-0 right-0 z-40 h-8 bg-caramel-100 text-cocoa-900 flex items-center justify-center px-3 sm:px-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            switchTo((displayIndex - 1 + messages.length) % messages.length)
          }
          aria-label="Previous message"
          className="hidden lg:flex size-11 -my-1.5 items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 shrink-0"
        >
          <ChevronLeft size={14} strokeWidth={1.75} />
        </button>

        <p
          aria-live="polite"
          className={`flex-1 text-center text-[13px] font-medium leading-none truncate transition-opacity duration-150 ease-soft motion-reduce:transition-none ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {messages[displayIndex]}
        </p>

        <button
          type="button"
          onClick={() => switchTo((displayIndex + 1) % messages.length)}
          aria-label="Next message"
          className="hidden lg:flex size-11 -my-1.5 items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 shrink-0"
        >
          <ChevronRight size={14} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
