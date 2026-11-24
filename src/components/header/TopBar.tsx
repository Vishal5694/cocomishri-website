"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export function TopBar() {
  const messages = siteConfig.topBarMessages;
  const [index, setIndex] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const [isPaused, setIsPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const fadeTimer = React.useRef<number | null>(null);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const stepTo = React.useCallback(
    (nextIdx: number) => {
      const normalized = (nextIdx + messages.length) % messages.length;
      if (reducedMotion) {
        setIndex(normalized);
        setVisible(true);
        return;
      }
      if (fadeTimer.current !== null) {
        window.clearTimeout(fadeTimer.current);
      }
      setVisible(false);
      fadeTimer.current = window.setTimeout(() => {
        setIndex(normalized);
        setVisible(true);
        fadeTimer.current = null;
      }, 150);
    },
    [messages.length, reducedMotion]
  );

  React.useEffect(() => {
    return () => {
      if (fadeTimer.current !== null) {
        window.clearTimeout(fadeTimer.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (reducedMotion || isPaused || messages.length <= 1) return;
    const id = window.setInterval(() => {
      stepTo(index + 1);
    }, 5000);
    return () => window.clearInterval(id);
  }, [reducedMotion, isPaused, messages.length, index, stepTo]);

  return (
    <div
      className="relative z-50 w-full h-8 bg-caramel-100 text-cocoa-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <Container className="h-full flex items-center justify-center relative">
        <button
          type="button"
          onClick={() => stepTo(index - 1)}
          aria-label="Previous message"
          className="hidden lg:flex absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 size-11 items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100/70 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <ChevronLeft size={16} strokeWidth={1.5} />
        </button>

        <p
          aria-live="polite"
          className={cn(
            "text-[13px] font-medium leading-none text-center truncate px-2 lg:px-14 transition-opacity duration-300 ease-soft motion-reduce:transition-none",
            visible ? "opacity-100" : "opacity-0"
          )}
        >
          {messages[index]}
        </p>

        <button
          type="button"
          onClick={() => stepTo(index + 1)}
          aria-label="Next message"
          className="hidden lg:flex absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 size-11 items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100/70 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <ChevronRight size={16} strokeWidth={1.5} />
        </button>
      </Container>
    </div>
  );
}
