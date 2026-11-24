"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselProps {
  children: React.ReactNode;
  itemCount?: number;
  trackLabel: string;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  headerSlot?: React.ReactNode;
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Carousel({
  children,
  itemCount,
  trackLabel,
  prevLabel = "Previous",
  nextLabel = "Next",
  className,
  headerSlot,
}: CarouselProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(true);
  const [activePage, setActivePage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(itemCount || 1);
  const [isGrabbing, setIsGrabbing] = React.useState(false);

  const rafRef = React.useRef<number | null>(null);
  const isPointerDownRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startScrollLeftRef = React.useRef(0);
  const hasDraggedRef = React.useRef(false);

  // Calculates visible page width in whole cards
  const getPageStep = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const firstChild = track.firstElementChild as HTMLElement | null;
    if (!firstChild) return track.clientWidth;

    const cardWidth = firstChild.offsetWidth;
    let gap = 16;
    const secondChild = firstChild.nextElementSibling as HTMLElement | null;
    if (secondChild) {
      const computedGap = secondChild.offsetLeft - (firstChild.offsetLeft + firstChild.offsetWidth);
      if (computedGap > 0) gap = computedGap;
    }

    const cardStride = cardWidth + gap;
    if (cardStride <= 0) return track.clientWidth;

    const cardsPerPage = Math.max(1, Math.floor((track.clientWidth + gap) / cardStride));
    return cardsPerPage * cardStride;
  }, []);

  const updateScrollState = React.useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    setCanScrollPrev(scrollLeft > 2);
    setCanScrollNext(scrollLeft < maxScroll - 2);

    const step = getPageStep();
    const pages = step > 0 && maxScroll > 0 ? Math.ceil(maxScroll / step) + 1 : 1;
    setTotalPages(pages);

    if (pages > 1 && step > 0) {
      if (scrollLeft >= maxScroll - 2) {
        setActivePage(pages - 1);
      } else {
        const current = Math.min(pages - 1, Math.max(0, Math.round(scrollLeft / step)));
        setActivePage(current);
      }
    } else {
      setActivePage(0);
    }
  }, [getPageStep]);

  // Throttled scroll listener using requestAnimationFrame
  const handleScroll = React.useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateScrollState();
    });
  }, [updateScrollState]);

  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollState();
    track.addEventListener("scroll", handleScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });

    resizeObserver.observe(track);
    Array.from(track.children).forEach((child) => resizeObserver.observe(child));

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      track.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, [handleScroll, updateScrollState]);

  const scrollByStep = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const pageStep = getPageStep();
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const target =
      direction > 0
        ? Math.min(maxScroll, track.scrollLeft + pageStep)
        : Math.max(0, track.scrollLeft - pageStep);

    const behavior = getPrefersReducedMotion() ? "auto" : "smooth";
    track.scrollTo({ left: target, behavior });
  };

  const scrollToPage = (pageIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const pageStep = getPageStep();
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const target =
      pageIndex >= totalPages - 1
        ? maxScroll
        : Math.min(maxScroll, pageIndex * pageStep);

    const behavior = getPrefersReducedMotion() ? "auto" : "smooth";
    track.scrollTo({ left: target, behavior });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByStep(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByStep(1);
    }
  };

  // Pointer event drag-to-scroll implementation
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = track.scrollLeft;
    hasDraggedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - startXRef.current;
    if (!hasDraggedRef.current && Math.abs(dx) > 5) {
      hasDraggedRef.current = true;
      setIsGrabbing(true);
      try {
        track.setPointerCapture(e.pointerId);
      } catch {}
    }

    if (hasDraggedRef.current) {
      track.scrollLeft = startScrollLeftRef.current - dx;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsGrabbing(false);

    const track = trackRef.current;
    if (track) {
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = false;
    setIsGrabbing(false);
    const track = trackRef.current;
    if (track) {
      try {
        track.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDraggedRef.current = false;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Top Header Row with Desktop Arrows */}
      <div className="flex items-end justify-between gap-4">
        {headerSlot || <div />}

        {/* Desktop Prev / Next Buttons (44x44, hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            disabled={!canScrollPrev}
            aria-disabled={!canScrollPrev}
            aria-label={prevLabel}
            className={cn(
              "size-11 flex items-center justify-center rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2",
              canScrollPrev
                ? "hover:bg-sand-100 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollByStep(1)}
            disabled={!canScrollNext}
            aria-disabled={!canScrollNext}
            aria-label={nextLabel}
            className={cn(
              "size-11 flex items-center justify-center rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2",
              canScrollNext
                ? "hover:bg-sand-100 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            )}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label={trackLabel}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClickCapture={handleClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={cn(
          "flex overflow-x-auto gap-4 pb-2 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          isGrabbing
            ? "cursor-grabbing select-none snap-none scroll-auto"
            : "cursor-grab snap-x snap-mandatory scroll-smooth"
        )}
      >
        {children}
      </div>

      {/* Small Dot Pagination (Bottom Right: 1 dot per page, hidden if pages <= 1) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1 pt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={activePage === i ? "true" : undefined}
              className="size-6 min-w-[24px] min-h-[24px] flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-1 transition-colors"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 block",
                  activePage === i
                    ? "w-5 bg-cocoa-900"
                    : "w-1.5 bg-sand-300 hover:bg-cocoa-500"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
