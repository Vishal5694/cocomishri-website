"use client";

import * as React from "react";
import { asset } from "@/lib/asset";
import { useSectionConfig } from "@/lib/customizer/CustomizerContext";
import {
  DEFAULT_WORLD_CONFIG,
  type WorldConfig,
} from "@/lib/world-config";
import { cn } from "@/lib/utils";

const BG_HEX: Record<WorldConfig["background"], string> = {
  "cream-50": "#FCF8F2",
  "sand-100": "#F4EADD",
  "blush-100": "#F8E6DF",
  "caramel-100": "#F7E8D8",
};

const SPEED_MULT: Record<WorldConfig["speed"], number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.7,
};

function tokenizeWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function splitWordPunctuation(token: string): { core: string; trail: string } {
  const match = token.match(/^([^\s.,!?;:]+)([.,!?;:]*)$/);
  if (!match) return { core: token, trail: "" };
  return { core: match[1], trail: match[2] };
}

export function WorldOfCocomishri() {
  const customCfg = useSectionConfig<WorldConfig>("world-of-cocomishri");
  const cfg = customCfg ?? DEFAULT_WORLD_CONFIG;

  const sectionRef = React.useRef<HTMLElement>(null);
  const hasPlayedRef = React.useRef(false);
  const [phase, setPhase] = React.useState<"done" | "armed" | "playing">(
    "done"
  );
  const [isInView, setIsInView] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const triggerPlay = React.useCallback(() => {
    if (!cfg.animationOn || reducedMotion) {
      setPhase("done");
      return;
    }
    setPhase("armed");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setPhase("playing");
      });
    });
  }, [cfg.animationOn, reducedMotion]);

  // Play once when >= 35% visible
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el || !cfg.animationOn || reducedMotion) {
      setPhase("done");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          triggerPlay();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [cfg.animationOn, reducedMotion, triggerPlay]);

  // Pause floating/breathing loops when off-screen
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Customizer Replay button listener
  React.useEffect(() => {
    const handleReplay = () => {
      hasPlayedRef.current = true;
      triggerPlay();
    };
    window.addEventListener("cm-world-replay", handleReplay);
    return () => window.removeEventListener("cm-world-replay", handleReplay);
  }, [triggerPlay]);

  const mult = SPEED_MULT[cfg.speed];
  const ms = (val: number) => `${Math.round(val * mult)}ms`;

  const highlightSet = React.useMemo(() => {
    return new Set(
      cfg.highlightWords
        .split(",")
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean)
    );
  }, [cfg.highlightWords]);

  const eyebrowWords = tokenizeWords(cfg.eyebrow);
  const headingLine1Words = tokenizeWords(cfg.headingLine1);
  const headingLine2Words = tokenizeWords(cfg.headingLine2);
  const totalHeadingWords = headingLine1Words.length + headingLine2Words.length;

  const paragraphs = [cfg.body1, cfg.body2, cfg.body3].filter((p) =>
    p.trim()
  );
  const bodyTokenCounts = paragraphs.map((p) => tokenizeWords(p));
  const totalBodyWords = bodyTokenCounts.reduce((acc, a) => acc + a.length, 0);

  let runningBodyIdx = 0;
  let runningHighlightIdx = 0;

  const bodyEndMs = 1800 + totalBodyWords * 30;
  const highlightStartMs = bodyEndMs + 150;
  const closingDelayMs = bodyEndMs + 1600;
  const mascotDelayMs = bodyEndMs + 2100;

  const isArmed = phase === "armed";
  const isPlaying = phase === "playing";
  const loopsRunning = isInView && !reducedMotion;

  const mascotElement = cfg.mascotOn ? (
    <div
      className={cn(
        "flex justify-center",
        cfg.mascotPosition === "above" ? "mb-6" : "mt-6"
      )}
    >
      <div
        style={{
          opacity: isArmed ? 0 : 1,
          transform: isArmed
            ? "translateY(16px) scale(0.96)"
            : "translateY(0) scale(1)",
          transition:
            isPlaying && !reducedMotion
              ? `opacity ${ms(900)} ease-out ${ms(mascotDelayMs)}, transform ${ms(900)} ease-out ${ms(mascotDelayMs)}`
              : undefined,
        }}
      >
        <img
          src={asset("/brand/mascot.svg")}
          alt=""
          loading="lazy"
          style={
            {
              "--w-mascot-d": `${cfg.mascotWidth}px`,
              "--w-mascot-m": `${Math.round(cfg.mascotWidth * (104 / 128))}px`,
              animation:
                cfg.mascotBreathing && !reducedMotion
                  ? "cm-world-breathe 6s ease-in-out infinite"
                  : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            } as React.CSSProperties
          }
          className="h-auto w-[var(--w-mascot-m)] lg:w-[var(--w-mascot-d)]"
        />
      </div>
    </div>
  ) : null;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="world-heading"
      style={
        {
          backgroundColor: BG_HEX[cfg.background],
          "--w-pad-d": `${cfg.sectionPadding}px`,
          "--w-pad-m": `${Math.round(cfg.sectionPadding * (64 / 96))}px`,
        } as React.CSSProperties
      }
      className="relative w-full overflow-hidden px-6 py-[var(--w-pad-m)] lg:py-[var(--w-pad-d)] text-center"
    >
      {/* Decorative Floating Crystals (hidden below 375px / narrow screens to prevent overlap) */}
      {cfg.crystalsOn && (
        <div
          aria-hidden="true"
          className="hidden min-[375px]:block pointer-events-none select-none"
        >
          {/* 1. 4-point sparkle (amber-500) */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            className="absolute left-[8%] top-[16%]"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 0s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          >
            <path
              d="M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z"
              fill="#D27821"
            />
          </svg>

          {/* 2. 4-point sparkle (caramel-500) */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            className="absolute right-[10%] top-[24%]"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 1.4s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          >
            <path
              d="M8 0 L9.8 6.2 L16 8 L9.8 9.8 L8 16 L6.2 9.8 L0 8 L6.2 6.2 Z"
              fill="#D18F5A"
            />
          </svg>

          {/* 3. Rounded square "sugar crystal" (sand-300) */}
          <span
            className="absolute left-[12%] bottom-[20%] size-[11px] rounded-[3px] bg-sand-300"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 2.6s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          />

          {/* 4. Rounded square "sugar crystal" (blush-100) */}
          <span
            className="absolute right-[14%] bottom-[28%] size-[10px] rounded-[3px] bg-blush-100 border border-blush-500/30"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 3.8s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          />

          {/* 5. Dot (blush-500) */}
          <span
            className="absolute right-[30%] top-[8%] size-[8px] rounded-full bg-blush-500"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 4.9s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center">
        {cfg.mascotPosition === "above" && mascotElement}

        {/* Eyebrow */}
        <p className="font-body font-semibold text-[11px] uppercase tracking-[0.2em] text-caramel-700 mb-3">
          {eyebrowWords.map((word, idx) => (
            <React.Fragment key={`eb-${idx}`}>
              <span
                className="inline-block"
                style={{
                  opacity: isArmed ? 0 : 1,
                  transform: isArmed ? "translateY(12px)" : "translateY(0)",
                  transition:
                    isPlaying && !reducedMotion
                      ? `opacity ${ms(700)} ease ${ms(idx * 120)}, transform ${ms(700)} ease ${ms(idx * 120)}`
                      : undefined,
                }}
              >
                {word}
              </span>
              {idx < eyebrowWords.length - 1 && " "}
            </React.Fragment>
          ))}
        </p>

        {/* Heading (h2) */}
        <h2
          id="world-heading"
          style={
            {
              "--w-h-d": `${cfg.headingSizeDesktop}px`,
              "--w-h-m": `${cfg.headingSizeMobile}px`,
            } as React.CSSProperties
          }
          className="font-heading [font-variation-settings:'SOFT'_75] font-medium text-cocoa-900 leading-[1.15] text-[length:var(--w-h-m)] lg:text-[length:var(--w-h-d)]"
        >
          {headingLine1Words.map((word, idx) => {
            const delayIdx = eyebrowWords.length + idx;
            return (
              <React.Fragment key={`h1-${idx}`}>
                <span
                  className="inline-block"
                  style={{
                    opacity: isArmed ? 0 : 1,
                    transform: isArmed ? "translateY(12px)" : "translateY(0)",
                    transition:
                      isPlaying && !reducedMotion
                        ? `opacity ${ms(700)} ease ${ms(delayIdx * 120)}, transform ${ms(700)} ease ${ms(delayIdx * 120)}`
                        : undefined,
                  }}
                >
                  {word}
                </span>
                {idx < headingLine1Words.length - 1 && " "}
              </React.Fragment>
            );
          })}
          <br />
          {headingLine2Words.map((word, idx) => {
            const delayIdx =
              eyebrowWords.length + headingLine1Words.length + idx;
            return (
              <React.Fragment key={`h2-${idx}`}>
                <span
                  className="inline-block"
                  style={{
                    opacity: isArmed ? 0 : 1,
                    transform: isArmed ? "translateY(12px)" : "translateY(0)",
                    transition:
                      isPlaying && !reducedMotion
                        ? `opacity ${ms(700)} ease ${ms(delayIdx * 120)}, transform ${ms(700)} ease ${ms(delayIdx * 120)}`
                        : undefined,
                  }}
                >
                  {word}
                </span>
                {idx < headingLine2Words.length - 1 && " "}
              </React.Fragment>
            );
          })}
        </h2>

        {/* Stitch Line */}
        {cfg.stitchOn ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 230 22"
            fill="none"
            className="w-[160px] lg:w-[200px] h-auto mx-auto mt-3 mb-6"
          >
            <defs>
              <mask id="cm-world-stitch-mask">
                <path
                  d="M4 14 C 50 2, 90 22, 130 10 S 200 4, 226 12"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="260"
                  strokeDashoffset={isArmed ? 260 : 0}
                  style={{
                    transition:
                      isPlaying && !reducedMotion
                        ? `stroke-dashoffset ${ms(1400)} ease ${ms(850 + totalHeadingWords * 0)}`
                        : undefined,
                  }}
                />
              </mask>
            </defs>
            <path
              d="M4 14 C 50 2, 90 22, 130 10 S 200 4, 226 12"
              stroke="#D4917F"
              strokeWidth="2"
              strokeDasharray="7 6"
              strokeLinecap="round"
              fill="none"
              mask="url(#cm-world-stitch-mask)"
            />
          </svg>
        ) : (
          <div className="h-6" aria-hidden="true" />
        )}

        {/* Lead */}
        <p
          className="font-heading italic font-normal text-cocoa-700 text-[17px] lg:text-[20px] max-w-[34rem] mb-4 leading-relaxed"
          style={{
            opacity: isArmed ? 0 : 1,
            transform: isArmed ? "translateY(8px)" : "translateY(0)",
            transition:
              isPlaying && !reducedMotion
                ? `opacity ${ms(900)} ease ${ms(1300)}, transform ${ms(900)} ease ${ms(1300)}`
                : undefined,
          }}
        >
          {cfg.lead}
        </p>

        {/* Body 1–3 */}
        <div
          style={
            {
              "--w-body-d": `${cfg.bodySize}px`,
              "--w-body-m": `${Math.max(14, cfg.bodySize - 1)}px`,
            } as React.CSSProperties
          }
          className="max-w-[36rem] space-y-3 mb-7 font-body font-normal leading-[1.75] text-cocoa-700 text-[length:var(--w-body-m)] lg:text-[length:var(--w-body-d)]"
        >
          {bodyTokenCounts.map((words, pIdx) => (
            <p key={`bp-${pIdx}`}>
              {words.map((token, wIdx) => {
                const wordDelay = 1800 + runningBodyIdx * 30;
                runningBodyIdx += 1;
                const { core, trail } = splitWordPunctuation(token);
                const isHighlighted = highlightSet.has(core.toLowerCase());
                const hDelay = isHighlighted
                  ? highlightStartMs + runningHighlightIdx * 320
                  : 0;
                if (isHighlighted) {
                  runningHighlightIdx += 1;
                }

                const wordColor =
                  isArmed && cfg.inkOn ? "#E3CFB6" : undefined;

                return (
                  <React.Fragment key={`bw-${pIdx}-${wIdx}`}>
                    <span
                      style={{
                        color: wordColor,
                        transition:
                          isPlaying && !reducedMotion && cfg.inkOn
                            ? `color ${ms(400)} ease ${ms(wordDelay)}`
                            : undefined,
                      }}
                    >
                      {isHighlighted ? (
                        <>
                          <span
                            className="text-cocoa-900 font-semibold px-1"
                            style={{
                              backgroundImage:
                                "linear-gradient(to top, #F8E6DF 45%, transparent 45%)",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: isArmed ? "0% 100%" : "100% 100%",
                              transition:
                                isPlaying && !reducedMotion
                                  ? `background-size ${ms(500)} ease ${ms(hDelay)}`
                                  : undefined,
                            }}
                          >
                            {core}
                          </span>
                          {trail}
                        </>
                      ) : (
                        token
                      )}
                    </span>
                    {wIdx < words.length - 1 && " "}
                  </React.Fragment>
                );
              })}
            </p>
          ))}
        </div>

        {/* Closing */}
        <p
          className="font-heading italic font-normal text-cocoa-900 text-[18px] lg:text-[22px]"
          style={{
            opacity: isArmed ? 0 : 1,
            transform: isArmed ? "translateY(8px)" : "translateY(0)",
            transition:
              isPlaying && !reducedMotion
                ? `opacity ${ms(800)} ease ${ms(closingDelayMs)}, transform ${ms(800)} ease ${ms(closingDelayMs)}`
                : undefined,
          }}
        >
          {cfg.closing}
        </p>

        {cfg.mascotPosition === "below" && mascotElement}
      </div>

      <style>{`
        @keyframes cm-world-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-9px) rotate(8deg); }
        }
        @keyframes cm-world-breathe {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </section>
  );
}
