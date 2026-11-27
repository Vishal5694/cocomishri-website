"use client";

import * as React from "react";
import { asset } from "@/lib/asset";
import { useSectionConfig } from "@/lib/customizer/CustomizerContext";
import { images } from "@/lib/images";
import {
  DEFAULT_WORLD_CONFIG,
  type WorldConfig,
} from "@/lib/world-config";
import { cn } from "@/lib/utils";

const SPEED_MULT: Record<WorldConfig["speed"], number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.7,
};

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const INK_MASK_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='m'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='2.2' intercept='-0.15'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23m)'/%3E%3C/svg%3E";

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

  const titleWords = tokenizeWords(cfg.title);
  const bodyWords = tokenizeWords(cfg.paragraph);

  const bodyEndMs = 1700 + bodyWords.length * 28;
  const highlightStartMs = bodyEndMs + 150;
  const closingDelayMs = bodyEndMs + 1400;

  let runningHighlightIdx = 0;

  const isArmed = phase === "armed";
  const isPlaying = phase === "playing";
  const loopsRunning = isInView && !reducedMotion;

  const realFabricSrc = images["world-fabric"]?.src;
  const isFabricMode = cfg.background === "fabric";
  const baseBgHex = cfg.background === "cream-50" ? "#FCF8F2" : "#F4EADD";
  const weaveMult = cfg.weaveStrength / 100;
  const grainOpacity = 0.06 * (cfg.grainStrength / 100);
  const useDefaultClampTitle =
    cfg.titleSizeDesktop === 64 && cfg.titleSizeMobile === 34;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="world-heading"
      style={
        {
          backgroundColor: baseBgHex,
          "--w-pad-d": `${cfg.sectionPadding}px`,
          "--w-pad-m": `${Math.round(cfg.sectionPadding * (72 / 112))}px`,
        } as React.CSSProperties
      }
      className="relative w-full overflow-hidden px-6 py-[var(--w-pad-m)] lg:py-[var(--w-pad-d)] text-center"
    >
      {/* Woven Fabric Background */}
      {isFabricMode && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          {realFabricSrc ? (
            <img
              src={asset(realFabricSrc)}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: [
                  `repeating-linear-gradient(0deg, rgba(69, 33, 4, ${(0.03 * weaveMult).toFixed(4)}) 0 1px, transparent 1px 3px)`,
                  `repeating-linear-gradient(90deg, rgba(69, 33, 4, ${(0.04 * weaveMult).toFixed(4)}) 0 1px, transparent 1px 4px)`,
                ].join(", "),
              }}
            />
          )}

          {/* Fine Grain Layer */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${NOISE_SVG}")`,
              backgroundRepeat: "repeat",
              opacity: grainOpacity,
              mixBlendMode: "multiply",
            }}
          />

          {/* Soft Cream Vignette (lighter centre for readability) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(252, 248, 242, 0.55) 0%, transparent 72%)",
            }}
          />
        </div>
      )}

      {/* Mascot Watermark ("Printed into the Fabric") */}
      {cfg.watermarkOn && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none"
        >
          <img
            src={asset("/brand/mascot.svg")}
            alt=""
            loading="lazy"
            style={{
              width: `min(${cfg.watermarkSize}px, 92vw)`,
              height: "auto",
              opacity: isArmed ? 0 : cfg.watermarkOpacity,
              transform: `translateY(${cfg.watermarkOffsetY}%)`,
              mixBlendMode: "multiply",
              filter: "sepia(0.3) saturate(0.7)",
              maskImage: `url("${INK_MASK_SVG}")`,
              WebkitMaskImage: `url("${INK_MASK_SVG}")`,
              maskSize: "160px 160px",
              WebkitMaskSize: "160px 160px",
              maskRepeat: "repeat",
              WebkitMaskRepeat: "repeat",
              transition:
                isPlaying && !reducedMotion
                  ? `opacity ${ms(1600)} ease 0ms`
                  : undefined,
            }}
          />
        </div>
      )}

      {/* Decorative Floating Crystals */}
      {cfg.crystalsOn && (
        <div
          aria-hidden="true"
          className="hidden min-[375px]:block pointer-events-none select-none"
        >
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

          <span
            className="absolute left-[12%] bottom-[20%] size-[11px] rounded-[3px] bg-sand-300"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 2.6s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          />

          <span
            className="absolute right-[14%] bottom-[28%] size-[10px] rounded-[3px] bg-blush-100 border border-blush-500/30"
            style={{
              animation: !reducedMotion
                ? "cm-world-float 7s ease-in-out 3.8s infinite"
                : undefined,
              animationPlayState: loopsRunning ? "running" : "paused",
            }}
          />

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

      {/* Text Content */}
      <div className="relative z-10 mx-auto max-w-3xl flex flex-col items-center">
        {/* Title (h2) */}
        <h2
          id="world-heading"
          style={
            useDefaultClampTitle
              ? { fontSize: "clamp(34px, 6vw, 64px)" }
              : ({
                  "--w-t-d": `${cfg.titleSizeDesktop}px`,
                  "--w-t-m": `${cfg.titleSizeMobile}px`,
                } as React.CSSProperties)
          }
          className={cn(
            "font-heading [font-variation-settings:'SOFT'_75] font-medium text-cocoa-900 tracking-[0.04em] leading-[1.05] max-w-[14ch] sm:max-w-none",
            !useDefaultClampTitle &&
              "text-[length:var(--w-t-m)] lg:text-[length:var(--w-t-d)]"
          )}
        >
          {titleWords.map((word, idx) => (
            <React.Fragment key={`wt-${idx}`}>
              <span
                className="inline-block"
                style={{
                  opacity: isArmed ? 0 : 1,
                  transform: isArmed ? "translateY(14px)" : "translateY(0)",
                  transition:
                    isPlaying && !reducedMotion
                      ? `opacity ${ms(800)} ease ${ms(100 + idx * 140)}, transform ${ms(800)} ease ${ms(100 + idx * 140)}`
                      : undefined,
                }}
              >
                {word}
              </span>
              {idx < titleWords.length - 1 && " "}
            </React.Fragment>
          ))}
        </h2>

        {/* Subtitle */}
        <p
          className="mt-4 font-heading italic font-normal text-cocoa-700 text-[19px] lg:text-[24px] leading-snug"
          style={{
            opacity: isArmed ? 0 : 1,
            transform: isArmed ? "translateY(8px)" : "translateY(0)",
            transition:
              isPlaying && !reducedMotion
                ? `opacity ${ms(800)} ease ${ms(800)}, transform ${ms(800)} ease ${ms(800)}`
                : undefined,
          }}
        >
          {cfg.subtitle}
        </p>

        {/* Stitch Line */}
        {cfg.stitchOn ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 230 22"
            fill="none"
            className="w-[170px] lg:w-[220px] h-auto mx-auto mt-[14px] mb-7"
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
                        ? `stroke-dashoffset ${ms(1400)} ease ${ms(1200)}`
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
          <div className="h-7" aria-hidden="true" />
        )}

        {/* Paragraph */}
        <p
          style={
            {
              "--w-body-d": `${cfg.bodySize}px`,
              "--w-body-m": `${Math.max(14, cfg.bodySize - 2)}px`,
            } as React.CSSProperties
          }
          className="max-w-[40rem] mb-7 font-body font-normal leading-[1.8] text-cocoa-700 text-[length:var(--w-body-m)] lg:text-[length:var(--w-body-d)]"
        >
          {bodyWords.map((token, wIdx) => {
            const wordDelay = 1700 + wIdx * 28;
            const { core, trail } = splitWordPunctuation(token);
            const isHighlighted = highlightSet.has(core.toLowerCase());
            const hDelay = isHighlighted
              ? highlightStartMs + runningHighlightIdx * 320
              : 0;
            if (isHighlighted) {
              runningHighlightIdx += 1;
            }
            const wordColor = isArmed && cfg.inkOn ? "#E3CFB6" : undefined;

            return (
              <React.Fragment key={`bw-${wIdx}`}>
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
                    <><span
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
                    >{core}</span>{trail}</>
                  ) : (
                    token
                  )}
                </span>
                {wIdx < bodyWords.length - 1 && " "}
              </React.Fragment>
            );
          })}
        </p>

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

        {/* Optional Bottom Mascot (OFF by default) */}
        {cfg.mascotOn && (
          <div className="mt-6 flex justify-center">
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
        )}
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
