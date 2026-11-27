"use client";

import * as React from "react";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Smartphone,
  RotateCcw,
  Share2,
  Copy,
} from "lucide-react";
import { homeHeroSection } from "@/lib/customizer/registry";
import type { Option, OptionGroup } from "@/lib/customizer/types";
import {
  useCustomizer,
  useSectionConfig,
  encodeBase64Utf8,
} from "@/lib/customizer/CustomizerContext";
import {
  HERO_V2_LINK_OPTIONS,
  HERO_V2_OPTIONAL_LINK_OPTIONS,
  type HeroV2Config,
  type HeroV2SlideSetting,
} from "@/lib/hero-v2-config";
import { PhonePreview } from "./PhonePreview";
import { cn } from "@/lib/utils";

const HERO_GROUPS: OptionGroup[] = [
  "Layout",
  "Slides",
  "Text",
  "Links",
  "Motion",
  "Controls",
  "Photos",
];

function buildHeroSummary(config: HeroV2Config): string {
  const lines: string[] = ["HOME HERO SETTINGS", ""];

  for (const opt of homeHeroSection.options) {
    if (opt.kind === "choice") {
      const val = String(config[opt.key as keyof HeroV2Config] ?? "");
      const choice = opt.choices.find((c) => c.value === val);
      lines.push(`${opt.label}: ${choice ? choice.label : val}`);
    } else if (opt.kind === "toggle") {
      const val = Boolean(config[opt.key as keyof HeroV2Config]);
      lines.push(`${opt.label}: ${val ? "On" : "Off"}`);
    } else if (opt.kind === "range") {
      const val = config[opt.key as keyof HeroV2Config];
      lines.push(`${opt.label}: ${val}${opt.unit ?? ""}`);
    } else if (opt.kind === "text") {
      const val = String(config[opt.key as keyof HeroV2Config] ?? "");
      lines.push(`${opt.label}: ${val}`);
    } else if (opt.kind === "multi") {
      const active = opt.choices
        .filter((c) => config.controls[c.value as keyof HeroV2Config["controls"]])
        .map((c) => c.label);
      lines.push(`${opt.label}: ${active.length > 0 ? active.join(", ") : "None"}`);
    }
  }

  lines.push("", "Slides (in order):");
  config.slides.forEach((s, idx) => {
    const status = s.enabled ? "ON" : "OFF";
    const parts = [
      `${idx + 1}. [${status}] ${s.title}`,
      `link1="${s.link1Text}" (${s.link1Href})`,
      s.link2Text && s.link2Href
        ? `link2="${s.link2Text}" (${s.link2Href})`
        : null,
      `focus=${s.focusX}% ${s.focusY}%`,
      s.previewVideoUrl ? `video=${s.previewVideoUrl}` : null,
    ].filter(Boolean);
    lines.push(parts.join(" | "));
  });

  lines.push("", "JSON:", JSON.stringify(config, null, 2));
  return lines.join("\n");
}

export function CustomizerPanel() {
  const heroConfig = useSectionConfig("home-hero");
  const { updateConfig, resetConfig } = useCustomizer();

  const [isOpen, setIsOpen] = React.useState(false);
  const [showPhonePreview, setShowPhonePreview] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [copiedMsg, setCopiedMsg] = React.useState<string | null>(null);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Layout: true,
    Slides: true,
    Text: false,
    Links: false,
    Motion: false,
    Controls: false,
    Photos: false,
  });

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);
  const copiedTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  React.useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  const flashCopied = (msg: string) => {
    setCopiedMsg(msg);
    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = window.setTimeout(() => {
      setCopiedMsg(null);
      copiedTimerRef.current = null;
    }, 2000);
  };

  const handleCopyShareLink = async () => {
    try {
      const encoded = encodeURIComponent(
        encodeBase64Utf8(JSON.stringify({ "home-hero": heroConfig }))
      );
      const url = `${window.location.origin}${window.location.pathname}${window.location.search}#cm=${encoded}`;
      await navigator.clipboard.writeText(url);
      flashCopied("Copied");
    } catch {
      flashCopied("Copied");
    }
  };

  const handleCopySettings = async () => {
    try {
      const text = buildHeroSummary(heroConfig);
      await navigator.clipboard.writeText(text);
      flashCopied("Copied");
    } catch {
      flashCopied("Copied");
    }
  };

  const updateSlide = (idx: number, patch: Partial<HeroV2SlideSetting>) => {
    const nextSlides = heroConfig.slides.map((s, i) =>
      i === idx ? { ...s, ...patch } : s
    );
    updateConfig("home-hero", { ...heroConfig, slides: nextSlides });
  };

  const moveSlide = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= heroConfig.slides.length) return;
    const nextSlides = [...heroConfig.slides];
    const [item] = nextSlides.splice(idx, 1);
    nextSlides.splice(target, 0, item);
    updateConfig("home-hero", { ...heroConfig, slides: nextSlides });
  };

  const renderOption = (opt: Option) => {
    const rawRecord = heroConfig as unknown as Record<string, unknown>;

    if (opt.kind === "choice") {
      const value = String(rawRecord[opt.key] ?? "");
      return (
        <div key={opt.key} className="space-y-1.5">
          <label
            htmlFor={`cm-opt-${opt.key}`}
            className="block text-[13px] font-semibold text-cocoa-900"
          >
            {opt.label}
          </label>
          <select
            id={`cm-opt-${opt.key}`}
            value={value}
            onChange={(e) =>
              updateConfig("home-hero", {
                ...heroConfig,
                [opt.key]: e.target.value,
              } as HeroV2Config)
            }
            className="w-full min-h-[44px] px-3 rounded-[10px] bg-sand-100 border border-sand-300 text-[14px] text-cocoa-900 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          >
            {opt.choices.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (opt.kind === "toggle") {
      const checked = Boolean(rawRecord[opt.key]);
      return (
        <label
          key={opt.key}
          className="min-h-[44px] flex items-center justify-between gap-3 cursor-pointer select-none"
        >
          <span className="text-[13px] font-semibold text-cocoa-900">
            {opt.label}
          </span>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) =>
              updateConfig("home-hero", {
                ...heroConfig,
                [opt.key]: e.target.checked,
              } as HeroV2Config)
            }
            className="size-5 accent-cocoa-900 cursor-pointer"
          />
        </label>
      );
    }

    if (opt.kind === "range") {
      const value = Number(rawRecord[opt.key] ?? opt.min);
      return (
        <div key={opt.key} className="space-y-1">
          <div className="flex items-center justify-between text-[13px] font-semibold text-cocoa-900">
            <label htmlFor={`cm-opt-${opt.key}`}>{opt.label}</label>
            <span className="tabular-nums text-cocoa-700">
              {value}
              {opt.unit ?? ""}
            </span>
          </div>
          <input
            id={`cm-opt-${opt.key}`}
            type="range"
            min={opt.min}
            max={opt.max}
            step={opt.step}
            value={value}
            onChange={(e) =>
              updateConfig("home-hero", {
                ...heroConfig,
                [opt.key]: Number(e.target.value),
              } as HeroV2Config)
            }
            className="w-full accent-cocoa-900 cursor-pointer"
          />
        </div>
      );
    }

    if (opt.kind === "text") {
      const value = String(rawRecord[opt.key] ?? "");
      return (
        <div key={opt.key} className="space-y-1">
          <label
            htmlFor={`cm-opt-${opt.key}`}
            className="block text-[13px] font-semibold text-cocoa-900"
          >
            {opt.label}
          </label>
          <input
            id={`cm-opt-${opt.key}`}
            type="text"
            value={value}
            maxLength={opt.maxLength}
            placeholder={opt.placeholder}
            onChange={(e) =>
              updateConfig("home-hero", {
                ...heroConfig,
                [opt.key]: e.target.value.slice(0, opt.maxLength),
              } as HeroV2Config)
            }
            className="w-full min-h-[44px] px-3 rounded-[10px] bg-sand-100 border border-sand-300 text-[14px] text-cocoa-900 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          />
        </div>
      );
    }

    if (opt.kind === "multi") {
      return (
        <fieldset key={opt.key} className="space-y-2">
          <legend className="text-[13px] font-semibold text-cocoa-900">
            {opt.label}
          </legend>
          <div className="grid grid-cols-2 gap-1.5">
            {opt.choices.map((c) => {
              const checked = Boolean(
                heroConfig.controls[c.value as keyof HeroV2Config["controls"]]
              );
              return (
                <label
                  key={c.value}
                  className="min-h-[44px] px-2.5 rounded-[10px] bg-sand-100 flex items-center gap-2 text-[13px] text-cocoa-900 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      updateConfig("home-hero", {
                        ...heroConfig,
                        controls: {
                          ...heroConfig.controls,
                          [c.value]: e.target.checked,
                        },
                      })
                    }
                    className="size-4 accent-cocoa-900 cursor-pointer"
                  />
                  <span>{c.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      );
    }

    return null;
  };

  const enabledCount = heroConfig.slides.filter((s) => s.enabled).length;

  return (
    <>
      {/* Floating Customize button (bottom-LEFT) */}
      {!isOpen && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-50 h-11 min-h-[44px] px-5 rounded-pill bg-cocoa-900 text-cream-50 font-body text-sm font-semibold shadow-lg inline-flex items-center gap-2 hover:bg-cocoa-700 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          <span>Customize</span>
        </button>
      )}

      {/* Floating Phone Preview */}
      {showPhonePreview && (
        <PhonePreview onClose={() => setShowPhonePreview(false)} />
      )}

      {/* 380px Left Side Panel (no scroll lock, no overlay) */}
      {isOpen && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-label="Section Customizer"
          className="fixed inset-y-0 left-0 z-50 w-full sm:w-[380px] bg-cream-50 text-cocoa-900 border-r border-sand-300 shadow-2xl flex flex-col font-body text-[14px]"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-sand-300 bg-sand-100 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-cocoa-700">
                Section Customizer
              </p>
              <h2 className="font-heading text-lg font-medium text-cocoa-900 leading-tight">
                {homeHeroSection.title}
              </h2>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close customizer"
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable Groups */}
          <div className="flex-1 overflow-y-auto divide-y divide-sand-300">
            {HERO_GROUPS.map((group) => {
              const isGroupOpen = !!openGroups[group];
              const groupOptions = homeHeroSection.options.filter(
                (o) => o.group === group
              );

              return (
                <div key={group} className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [group]: !prev[group],
                      }))
                    }
                    aria-expanded={isGroupOpen}
                    className="w-full min-h-[44px] flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.06em] text-cocoa-900 text-left"
                  >
                    <span>{group}</span>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className={cn(
                        "transition-transform duration-200",
                        isGroupOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isGroupOpen && (
                    <div className="pb-4 pt-2 space-y-4">
                      {groupOptions.map((opt) => renderOption(opt))}

                      {group === "Slides" && (
                        <div className="space-y-3">
                          {heroConfig.slides.map((slide, idx) => (
                            <div
                              key={slide.id}
                              className="p-3 rounded-[12px] bg-sand-100 border border-sand-300 space-y-2.5"
                            >
                              {/* Slide Header: checkbox, title label, reorder arrows */}
                              <div className="flex items-center justify-between gap-2">
                                <label className="min-h-[44px] flex items-center gap-2 cursor-pointer flex-1">
                                  <input
                                    type="checkbox"
                                    checked={slide.enabled}
                                    disabled={slide.enabled && enabledCount <= 1}
                                    onChange={(e) =>
                                      updateSlide(idx, {
                                        enabled: e.target.checked,
                                      })
                                    }
                                    className="size-4 accent-cocoa-900 cursor-pointer"
                                  />
                                  <span className="font-semibold text-[13px] text-cocoa-900">
                                    {slide.title || slide.id}
                                  </span>
                                </label>

                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => moveSlide(idx, -1)}
                                    disabled={idx === 0}
                                    aria-label={`Move ${slide.title} up`}
                                    className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 disabled:opacity-30"
                                  >
                                    <ArrowUp size={15} strokeWidth={1.5} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveSlide(idx, 1)}
                                    disabled={idx === heroConfig.slides.length - 1}
                                    aria-label={`Move ${slide.title} down`}
                                    className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 disabled:opacity-30"
                                  >
                                    <ArrowDown size={15} strokeWidth={1.5} />
                                  </button>
                                </div>
                              </div>

                              {/* Slide text & focus fields */}
                              <div className="space-y-2">
                                <div>
                                  <label
                                    htmlFor={`slide-title-${slide.id}`}
                                    className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                  >
                                    Title
                                  </label>
                                  <input
                                    id={`slide-title-${slide.id}`}
                                    type="text"
                                    maxLength={80}
                                    value={slide.title}
                                    onChange={(e) =>
                                      updateSlide(idx, {
                                        title: e.target.value.slice(0, 80),
                                      })
                                    }
                                    className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label
                                      htmlFor={`slide-btn-${slide.id}`}
                                      className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                    >
                                      Link 1 text
                                    </label>
                                    <input
                                      id={`slide-btn-${slide.id}`}
                                      type="text"
                                      maxLength={80}
                                      value={slide.link1Text}
                                      onChange={(e) =>
                                        updateSlide(idx, {
                                          link1Text: e.target.value.slice(0, 80),
                                        })
                                      }
                                      className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`slide-href1-${slide.id}`}
                                      className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                    >
                                      Link 1 page
                                    </label>
                                    <select
                                      id={`slide-href1-${slide.id}`}
                                      value={slide.link1Href}
                                      onChange={(e) =>
                                        updateSlide(idx, {
                                          link1Href: e.target.value,
                                        })
                                      }
                                      className="w-full min-h-[40px] px-2 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                    >
                                      {HERO_V2_LINK_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label
                                      htmlFor={`slide-btn2-${slide.id}`}
                                      className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                    >
                                      Link 2 text
                                    </label>
                                    <input
                                      id={`slide-btn2-${slide.id}`}
                                      type="text"
                                      maxLength={80}
                                      placeholder="Optional"
                                      value={slide.link2Text}
                                      onChange={(e) =>
                                        updateSlide(idx, {
                                          link2Text: e.target.value.slice(0, 80),
                                        })
                                      }
                                      className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor={`slide-href2-${slide.id}`}
                                      className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                    >
                                      Link 2 page
                                    </label>
                                    <select
                                      id={`slide-href2-${slide.id}`}
                                      value={slide.link2Href}
                                      onChange={(e) =>
                                        updateSlide(idx, {
                                          link2Href: e.target.value,
                                        })
                                      }
                                      className="w-full min-h-[40px] px-2 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                    >
                                      {HERO_V2_OPTIONAL_LINK_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-1">
                                  <div>
                                    <div className="flex justify-between text-[12px] text-cocoa-700">
                                      <label htmlFor={`slide-fx-${slide.id}`}>
                                        Focus X
                                      </label>
                                      <span>{slide.focusX}%</span>
                                    </div>
                                    <input
                                      id={`slide-fx-${slide.id}`}
                                      type="range"
                                      min={0}
                                      max={100}
                                      value={slide.focusX}
                                      onChange={(e) =>
                                        updateSlide(idx, {
                                          focusX: Number(e.target.value),
                                        })
                                      }
                                      className="w-full accent-cocoa-900 cursor-pointer"
                                    />
                                  </div>

                                  <div>
                                    <div className="flex justify-between text-[12px] text-cocoa-700">
                                      <label htmlFor={`slide-fy-${slide.id}`}>
                                        Focus Y
                                      </label>
                                      <span>{slide.focusY}%</span>
                                    </div>
                                    <input
                                      id={`slide-fy-${slide.id}`}
                                      type="range"
                                      min={0}
                                      max={100}
                                      value={slide.focusY}
                                      onChange={(e) =>
                                        updateSlide(idx, {
                                          focusY: Number(e.target.value),
                                        })
                                      }
                                      className="w-full accent-cocoa-900 cursor-pointer"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label
                                    htmlFor={`slide-vid-${slide.id}`}
                                    className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                  >
                                    Preview video URL
                                  </label>
                                  <input
                                    id={`slide-vid-${slide.id}`}
                                    type="text"
                                    maxLength={80}
                                    value={slide.previewVideoUrl}
                                    placeholder="/videos/clip.mp4"
                                    onChange={(e) =>
                                      updateSlide(idx, {
                                        previewVideoUrl: e.target.value.slice(
                                          0,
                                          80
                                        ),
                                      })
                                    }
                                    className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline Reset Confirmation */}
          {confirmReset && (
            <div className="px-4 py-3 bg-blush-100 border-t border-sand-300 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[13px] font-medium text-cocoa-900">
                Reset all hero settings?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetConfig("home-hero");
                    setConfirmReset(false);
                  }}
                  className="min-h-[36px] px-3 rounded-pill bg-cocoa-900 text-cream-50 text-xs font-semibold"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-[36px] px-3 rounded-pill border border-cocoa-900 text-cocoa-900 text-xs font-semibold"
                >
                  No
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-3 border-t border-sand-300 bg-sand-100 space-y-2 shrink-0">
            {copiedMsg && (
              <p
                role="status"
                aria-live="polite"
                className="text-center text-xs font-semibold text-cocoa-900"
              >
                {copiedMsg}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowPhonePreview((prev) => !prev)}
                className="min-h-[44px] px-3 rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-sand-300/30"
              >
                <Smartphone size={15} strokeWidth={1.5} />
                <span>Phone preview</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[44px] px-3 rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-sand-300/30"
              >
                <RotateCcw size={15} strokeWidth={1.5} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="min-h-[44px] px-3 rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-sand-300/30"
              >
                <Share2 size={15} strokeWidth={1.5} />
                <span>Share link</span>
              </button>

              <button
                type="button"
                onClick={handleCopySettings}
                className="min-h-[44px] px-3 rounded-pill bg-cocoa-900 text-cream-50 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-cocoa-700"
              >
                <Copy size={15} strokeWidth={1.5} />
                <span>Copy settings</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
