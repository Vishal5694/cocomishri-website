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
import {
  homeHeroSection,
  siteHeaderSection,
  customizerSections,
  type SectionId,
} from "@/lib/customizer/registry";
import type { Option, OptionGroup } from "@/lib/customizer/types";
import {
  useCustomizer,
  encodeBase64Utf8,
  type ConfigMap,
} from "@/lib/customizer/CustomizerContext";
import type { HeroConfig, SlideSetting } from "@/lib/hero-config";
import type { HeaderConfig, TopBarMessageSetting } from "@/lib/header-config";
import {
  brandColors,
  contrastRatio,
  getBrandHex,
  type BrandColorKey,
  type LogoColorKey,
} from "@/lib/brand-colors";
import { siteConfig } from "@/lib/site-config";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { PhonePreview } from "./PhonePreview";
import { cn } from "@/lib/utils";

const HERO_GROUPS: OptionGroup[] = [
  "Layout",
  "Slides",
  "Text",
  "Motion & controls",
  "Button",
  "Photos",
];

const HEADER_GROUPS: OptionGroup[] = [
  "Top bar",
  "Logo",
  "Header bar",
  "Over the hero",
  "Scrolling",
  "Right side",
  "Drawer",
];

function formatColorValue(val: string): string {
  if (val === "original") return "original";
  const found = brandColors.find((c) => c.key === val);
  return found ? `${found.key} ${found.hex}` : val;
}

function buildHeroSummary(config: HeroConfig): string {
  const lines: string[] = ["HOME HERO SETTINGS", ""];

  for (const opt of homeHeroSection.options) {
    if (opt.kind === "choice") {
      const val = String(config[opt.key as keyof HeroConfig] ?? "");
      const choice = opt.choices.find((c) => c.value === val);
      lines.push(`${opt.label}: ${choice ? choice.label : val}`);
    } else if (opt.kind === "toggle") {
      const val = Boolean(config[opt.key as keyof HeroConfig]);
      lines.push(`${opt.label}: ${val ? "On" : "Off"}`);
    } else if (opt.kind === "range") {
      const val = config[opt.key as keyof HeroConfig];
      lines.push(`${opt.label}: ${val}${opt.unit ?? ""}`);
    } else if (opt.kind === "text") {
      const val = String(config[opt.key as keyof HeroConfig] ?? "");
      lines.push(`${opt.label}: ${val}`);
    } else if (opt.kind === "multi") {
      const active = opt.choices
        .filter((c) => config.controls[c.value as keyof HeroConfig["controls"]])
        .map((c) => c.label);
      lines.push(`${opt.label}: ${active.length > 0 ? active.join(", ") : "None"}`);
    }
  }

  lines.push("", "Slides (in order):");
  config.slides.forEach((s, idx) => {
    const status = s.enabled ? "ON" : "OFF";
    const parts = [
      `${idx + 1}. [${status}] ${s.title}`,
      s.line ? `line="${s.line}"` : null,
      `button="${s.buttonText}"`,
      `focus=${s.focusX}% ${s.focusY}%`,
      s.previewVideoUrl ? `video=${s.previewVideoUrl}` : null,
    ].filter(Boolean);
    lines.push(parts.join(" | "));
  });

  lines.push("", "JSON:", JSON.stringify(config, null, 2));
  return lines.join("\n");
}

function buildHeaderSummary(config: HeaderConfig): string {
  const lines: string[] = ["HEADER SETTINGS", ""];

  for (const opt of siteHeaderSection.options) {
    if (opt.kind === "choice") {
      const val = String(config[opt.key as keyof HeaderConfig] ?? "");
      const choice = opt.choices.find((c) => c.value === val);
      lines.push(`${opt.label}: ${choice ? choice.label : val}`);
    } else if (opt.kind === "toggle") {
      const val = Boolean(config[opt.key as keyof HeaderConfig]);
      lines.push(`${opt.label}: ${val ? "On" : "Off"}`);
    } else if (opt.kind === "range") {
      const val = config[opt.key as keyof HeaderConfig];
      lines.push(`${opt.label}: ${val}${opt.unit ?? ""}`);
    } else if (opt.kind === "color") {
      const val = String(config[opt.key as keyof HeaderConfig] ?? "");
      lines.push(`${opt.label}: ${formatColorValue(val)}`);
    }
  }

  lines.push("", "Top bar messages (in order):");
  config.topBarMessages.forEach((m, idx) => {
    const text = siteConfig.topBarMessages[m.id] ?? "";
    lines.push(`${idx + 1}. [${m.enabled ? "ON" : "OFF"}] ${text}`);
  });

  lines.push("", "JSON:", JSON.stringify(config, null, 2));
  return lines.join("\n");
}

function ContrastBadge({
  label,
  fgHex,
  bgHex,
  minRatio,
  note,
}: {
  label: string;
  fgHex: string;
  bgHex: string;
  minRatio: number;
  note?: string;
}) {
  const ratio = contrastRatio(fgHex, bgHex);
  const ok = ratio >= minRatio;
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-[10px] bg-sand-100 border border-sand-300 text-[12px]">
      <div className="min-w-0">
        <span className="font-medium text-cocoa-900">{label}</span>
        {note && (
          <span className="block text-[11px] text-cocoa-700">{note}</span>
        )}
      </div>
      <span
        className={cn(
          "font-semibold tabular-nums shrink-0",
          ok ? "text-sage-700" : "text-blush-700"
        )}
      >
        {ratio.toFixed(1)}:1 {ok ? "✓" : "– hard to read"}
      </span>
    </div>
  );
}

export function CustomizerPanel() {
  const { configs, updateConfig, resetConfig } = useCustomizer();
  const [activeSection, setActiveSection] =
    React.useState<SectionId>("home-hero");
  const [copyScope, setCopyScope] = React.useState<"section" | "all">(
    "section"
  );

  const heroConfig = configs["home-hero"];
  const headerConfig = configs["site-header"];

  const [isOpen, setIsOpen] = React.useState(false);
  const [showPhonePreview, setShowPhonePreview] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [copiedMsg, setCopiedMsg] = React.useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = React.useState<
    Record<string, string | null>
  >({});
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Layout: true,
    Slides: true,
    Text: false,
    "Motion & controls": false,
    Button: false,
    Photos: false,
    "Top bar": true,
    Logo: true,
    "Header bar": false,
    "Over the hero": false,
    Scrolling: false,
    "Right side": false,
    Drawer: false,
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
        encodeBase64Utf8(JSON.stringify(configs))
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
      const text =
        copyScope === "all"
          ? [buildHeroSummary(heroConfig), "", "---", "", buildHeaderSummary(headerConfig)].join("\n")
          : activeSection === "home-hero"
          ? buildHeroSummary(heroConfig)
          : buildHeaderSummary(headerConfig);
      await navigator.clipboard.writeText(text);
      flashCopied("Copied");
    } catch {
      flashCopied("Copied");
    }
  };

  const updateSlide = (idx: number, patch: Partial<SlideSetting>) => {
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

  const updateTopBarMsg = (
    idx: number,
    patch: Partial<TopBarMessageSetting>
  ) => {
    const nextMsgs = headerConfig.topBarMessages.map((m, i) =>
      i === idx ? { ...m, ...patch } : m
    );
    updateConfig("site-header", { ...headerConfig, topBarMessages: nextMsgs });
  };

  const moveTopBarMsg = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= headerConfig.topBarMessages.length) return;
    const nextMsgs = [...headerConfig.topBarMessages];
    const [item] = nextMsgs.splice(idx, 1);
    nextMsgs.splice(target, 0, item);
    updateConfig("site-header", { ...headerConfig, topBarMessages: nextMsgs });
  };

  const currentConfig =
    activeSection === "home-hero" ? heroConfig : headerConfig;

  const setField = (key: string, value: unknown) => {
    if (activeSection === "home-hero") {
      updateConfig("home-hero", {
        ...heroConfig,
        [key]: value,
      } as HeroConfig);
    } else {
      const numericKeys = new Set(["topBarHeight", "drawerWidth"]);
      const parsedVal = numericKeys.has(key) ? Number(value) : value;
      updateConfig("site-header", {
        ...headerConfig,
        [key]: parsedVal,
      } as HeaderConfig);
    }
  };

  const renderOption = (opt: Option) => {
    const rawRecord = currentConfig as unknown as Record<string, unknown>;

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
            onChange={(e) => setField(opt.key, e.target.value)}
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
            onChange={(e) => setField(opt.key, e.target.checked)}
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
            onChange={(e) => setField(opt.key, Number(e.target.value))}
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
              setField(opt.key, e.target.value.slice(0, opt.maxLength))
            }
            className="w-full min-h-[44px] px-3 rounded-[10px] bg-sand-100 border border-sand-300 text-[14px] text-cocoa-900 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
          />
        </div>
      );
    }

    if (opt.kind === "color") {
      const selected = String(rawRecord[opt.key] ?? "");
      const displayKey = hoveredColor[opt.key] ?? selected;
      const displayHex =
        displayKey === "original"
          ? "Original"
          : `${displayKey} (${getBrandHex(displayKey as BrandColorKey)})`;

      return (
        <fieldset key={opt.key} className="space-y-1.5">
          <legend className="text-[13px] font-semibold text-cocoa-900">
            {opt.label}
          </legend>
          <div className="flex flex-wrap gap-0.5">
            {opt.allowOriginal && (
              <button
                type="button"
                aria-label="Original brand colours"
                title="original"
                aria-pressed={selected === "original"}
                onClick={() => setField(opt.key, "original" as LogoColorKey)}
                onMouseEnter={() =>
                  setHoveredColor((p) => ({ ...p, [opt.key]: "original" }))
                }
                onMouseLeave={() =>
                  setHoveredColor((p) => ({ ...p, [opt.key]: null }))
                }
                onFocus={() =>
                  setHoveredColor((p) => ({ ...p, [opt.key]: "original" }))
                }
                onBlur={() =>
                  setHoveredColor((p) => ({ ...p, [opt.key]: null }))
                }
                className="size-11 flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-blush-700"
              >
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #452104 50%, #9A4F45 50%)",
                  }}
                  className={cn(
                    "size-7 rounded-full border border-sand-300 block",
                    selected === "original" &&
                      "ring-2 ring-cocoa-900 ring-offset-2 ring-offset-cream-50"
                  )}
                />
              </button>
            )}
            {brandColors.map((c) => {
              const isSelected = selected === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  aria-label={`${c.key} ${c.hex}`}
                  title={c.key}
                  aria-pressed={isSelected}
                  onClick={() => setField(opt.key, c.key)}
                  onMouseEnter={() =>
                    setHoveredColor((p) => ({ ...p, [opt.key]: c.key }))
                  }
                  onMouseLeave={() =>
                    setHoveredColor((p) => ({ ...p, [opt.key]: null }))
                  }
                  onFocus={() =>
                    setHoveredColor((p) => ({ ...p, [opt.key]: c.key }))
                  }
                  onBlur={() =>
                    setHoveredColor((p) => ({ ...p, [opt.key]: null }))
                  }
                  className="size-11 flex items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-blush-700"
                >
                  <span
                    style={{ backgroundColor: c.hex }}
                    className={cn(
                      "size-7 rounded-full border border-cocoa-900/15 block",
                      isSelected &&
                        "ring-2 ring-cocoa-900 ring-offset-2 ring-offset-cream-50"
                    )}
                  />
                </button>
              );
            })}
          </div>
          <p className="text-[11px] font-medium text-cocoa-700">{displayHex}</p>
        </fieldset>
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
                heroConfig.controls[c.value as keyof HeroConfig["controls"]]
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
  const activeSectionObj =
    customizerSections.find((s) => s.id === activeSection) ?? homeHeroSection;
  const activeGroups =
    activeSection === "home-hero" ? HERO_GROUPS : HEADER_GROUPS;

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
          {/* Header + Section Switcher */}
          <div className="px-4 py-3 border-b border-sand-300 bg-sand-100 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-cocoa-700">
                  Section Customizer
                </p>
                <h2 className="font-heading text-lg font-medium text-cocoa-900 leading-tight">
                  {activeSectionObj.title}
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

            <div
              role="tablist"
              aria-label="Customize section"
              className="grid grid-cols-2 gap-1 p-1 rounded-pill bg-cream-50 border border-sand-300"
            >
              {customizerSections.map((sec) => {
                const selected = sec.id === activeSection;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveSection(sec.id);
                      setConfirmReset(false);
                    }}
                    className={cn(
                      "min-h-[36px] px-3 rounded-pill text-[12px] font-semibold transition-colors",
                      selected
                        ? "bg-cocoa-900 text-cream-50"
                        : "text-cocoa-700 hover:text-cocoa-900"
                    )}
                  >
                    {sec.title}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Groups */}
          <div className="flex-1 overflow-y-auto divide-y divide-sand-300">
            {activeGroups.map((group) => {
              const isGroupOpen = !!openGroups[group];
              const groupOptions = activeSectionObj.options.filter(
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

                      {activeSection === "home-hero" && group === "Slides" && (
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
                                    disabled={
                                      idx === heroConfig.slides.length - 1
                                    }
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

                                <div>
                                  <label
                                    htmlFor={`slide-line-${slide.id}`}
                                    className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                  >
                                    Line
                                  </label>
                                  <input
                                    id={`slide-line-${slide.id}`}
                                    type="text"
                                    maxLength={80}
                                    value={slide.line}
                                    onChange={(e) =>
                                      updateSlide(idx, {
                                        line: e.target.value.slice(0, 80),
                                      })
                                    }
                                    className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor={`slide-btn-${slide.id}`}
                                    className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                                  >
                                    Button text
                                  </label>
                                  <input
                                    id={`slide-btn-${slide.id}`}
                                    type="text"
                                    maxLength={80}
                                    value={slide.buttonText}
                                    onChange={(e) =>
                                      updateSlide(idx, {
                                        buttonText: e.target.value.slice(0, 80),
                                      })
                                    }
                                    className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                                  />
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
                      {activeSection === "site-header" && group === "Top bar" && (
                        <div className="space-y-3 pt-1">
                          <ContrastBadge
                            label="Top bar text contrast"
                            fgHex={getBrandHex(headerConfig.topBarText)}
                            bgHex={getBrandHex(headerConfig.topBarBg)}
                            minRatio={4.5}
                          />
                          <div className="space-y-1.5">
                            <p className="text-[13px] font-semibold text-cocoa-900">
                              Messages (in order)
                            </p>
                            {headerConfig.topBarMessages.map((msg, idx) => {
                              const labelText =
                                siteConfig.topBarMessages[msg.id] ?? "";
                              return (
                                <div
                                  key={msg.id}
                                  className="px-2.5 py-1.5 rounded-[10px] bg-sand-100 border border-sand-300 flex items-center justify-between gap-2"
                                >
                                  <label className="min-h-[40px] flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={msg.enabled}
                                      onChange={(e) =>
                                        updateTopBarMsg(idx, {
                                          enabled: e.target.checked,
                                        })
                                      }
                                      className="size-4 accent-cocoa-900 shrink-0 cursor-pointer"
                                    />
                                    <span className="text-[12px] text-cocoa-900 truncate">
                                      {labelText}
                                    </span>
                                  </label>
                                  <div className="flex items-center shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => moveTopBarMsg(idx, -1)}
                                      disabled={idx === 0}
                                      aria-label={`Move message ${idx + 1} up`}
                                      className="size-9 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 disabled:opacity-30"
                                    >
                                      <ArrowUp size={14} strokeWidth={1.5} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => moveTopBarMsg(idx, 1)}
                                      disabled={
                                        idx ===
                                        headerConfig.topBarMessages.length - 1
                                      }
                                      aria-label={`Move message ${idx + 1} down`}
                                      className="size-9 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 disabled:opacity-30"
                                    >
                                      <ArrowDown size={14} strokeWidth={1.5} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activeSection === "site-header" && group === "Logo" && (
                        <div className="space-y-3 pt-1">
                          <div className="grid grid-cols-2 gap-2">
                            <div
                              style={{
                                backgroundColor: getBrandHex(
                                  headerConfig.headerBg
                                ),
                              }}
                              className="p-3 rounded-[10px] border border-sand-300 flex flex-col items-center justify-center gap-1.5 min-h-[68px]"
                            >
                              <BrandLogo
                                variant={headerConfig.logoVariant}
                                color={headerConfig.logoColor}
                                heightMobile={28}
                                heightDesktop={28}
                                asPreview
                              />
                              <span
                                style={{
                                  color: getBrandHex(headerConfig.iconColor),
                                }}
                                className="text-[10px] font-medium"
                              >
                                On header
                              </span>
                            </div>
                            <div
                              style={{ backgroundColor: "#452104" }}
                              className="p-3 rounded-[10px] border border-sand-300 flex flex-col items-center justify-center gap-1.5 min-h-[68px]"
                            >
                              <BrandLogo
                                variant={headerConfig.logoVariant}
                                color={headerConfig.logoColorOverHero}
                                heightMobile={28}
                                heightDesktop={28}
                                asPreview
                              />
                              <span
                                style={{
                                  color: getBrandHex(
                                    headerConfig.iconColorOverHero
                                  ),
                                }}
                                className="text-[10px] font-medium"
                              >
                                Over hero
                              </span>
                            </div>
                          </div>
                          <ContrastBadge
                            label="Logo contrast on header"
                            fgHex={
                              headerConfig.logoColor === "original"
                                ? "#452104"
                                : getBrandHex(headerConfig.logoColor)
                            }
                            bgHex={getBrandHex(headerConfig.headerBg)}
                            minRatio={3}
                          />
                        </div>
                      )}

                      {activeSection === "site-header" &&
                        group === "Header bar" && (
                          <ContrastBadge
                            label="Icon contrast on header"
                            fgHex={getBrandHex(headerConfig.iconColor)}
                            bgHex={getBrandHex(headerConfig.headerBg)}
                            minRatio={3}
                          />
                        )}

                      {activeSection === "site-header" &&
                        group === "Over the hero" && (
                          <div className="space-y-2">
                            <ContrastBadge
                              label="Logo over hero"
                              note="approximate, photo-dependent"
                              fgHex={
                                headerConfig.logoColorOverHero === "original"
                                  ? "#452104"
                                  : getBrandHex(headerConfig.logoColorOverHero)
                              }
                              bgHex="#452104"
                              minRatio={3}
                            />
                            <ContrastBadge
                              label="Icons over hero"
                              note="approximate, photo-dependent"
                              fgHex={getBrandHex(
                                headerConfig.iconColorOverHero
                              )}
                              bgHex="#452104"
                              minRatio={3}
                            />
                          </div>
                        )}

                      {activeSection === "site-header" &&
                        group === "Drawer" && (
                          <ContrastBadge
                            label="Highlight link contrast"
                            fgHex={getBrandHex(headerConfig.highlightColor)}
                            bgHex={getBrandHex(headerConfig.drawerBg)}
                            minRatio={4.5}
                          />
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
                Reset{" "}
                {activeSection === "home-hero"
                  ? "all hero settings?"
                  : "all header settings?"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetConfig(activeSection);
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
            <div className="flex items-center justify-between text-[11px] font-semibold text-cocoa-700 px-1">
              <span>Copy scope:</span>
              <div className="inline-flex rounded-pill bg-cream-50 border border-sand-300 p-0.5">
                <button
                  type="button"
                  onClick={() => setCopyScope("section")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-pill transition-colors",
                    copyScope === "section"
                      ? "bg-cocoa-900 text-cream-50"
                      : "text-cocoa-700"
                  )}
                >
                  This section
                </button>
                <button
                  type="button"
                  onClick={() => setCopyScope("all")}
                  className={cn(
                    "px-2.5 py-0.5 rounded-pill transition-colors",
                    copyScope === "all"
                      ? "bg-cocoa-900 text-cream-50"
                      : "text-cocoa-700"
                  )}
                >
                  All sections
                </button>
              </div>
            </div>
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
