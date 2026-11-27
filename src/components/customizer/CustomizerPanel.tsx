"use client";

import * as React from "react";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  Smartphone,
  RotateCcw,
  Share2,
  Copy,
  Play,
} from "lucide-react";
import { customizerSections, type SectionId } from "@/lib/customizer/registry";
import type { Option } from "@/lib/customizer/types";
import {
  useCustomizer,
  encodeBase64Utf8,
} from "@/lib/customizer/CustomizerContext";
import { PhonePreview } from "./PhonePreview";
import { cn } from "@/lib/utils";

function buildSummary(
  sectionId: SectionId,
  config: Record<string, unknown>
): string {
  const sec = customizerSections.find((s) => s.id === sectionId);
  if (!sec) return JSON.stringify(config, null, 2);

  const lines: string[] = [`${sec.title.toUpperCase()} SETTINGS`, ""];
  for (const opt of sec.options) {
    if (opt.kind === "choice") {
      const val = String(config[opt.key] ?? "");
      const choice = opt.choices.find((c) => c.value === val);
      lines.push(`${opt.label}: ${choice ? choice.label : val}`);
    } else if (opt.kind === "toggle") {
      lines.push(`${opt.label}: ${config[opt.key] ? "On" : "Off"}`);
    } else if (opt.kind === "range") {
      lines.push(`${opt.label}: ${config[opt.key]}${opt.unit ?? ""}`);
    } else if (opt.kind === "text") {
      lines.push(`${opt.label}: ${config[opt.key] ?? ""}`);
    }
  }

  lines.push("", "JSON:", JSON.stringify(config, null, 2));
  return lines.join("\n");
}

export function CustomizerPanel() {
  const { configs, updateConfig, resetConfig } = useCustomizer();
  const [activeSection, setActiveSection] = React.useState<SectionId>(
    customizerSections[0]?.id ?? "world-of-cocomishri"
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [showPhonePreview, setShowPhonePreview] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [copiedMsg, setCopiedMsg] = React.useState<string | null>(null);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Copy: false,
    "Typography & layout": true,
    "Fabric & watermark": true,
    Animation: true,
    "Bottom mascot": false,
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

  if ((customizerSections as readonly unknown[]).length === 0) {
    return null;
  }

  const section =
    customizerSections.find((s) => s.id === activeSection) ??
    customizerSections[0];
  const currentConfig = (configs[section.id] ?? section.defaults) as Record<
    string,
    unknown
  >;
  const groups = Array.from(new Set(section.options.map((o) => o.group)));

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
      await navigator.clipboard.writeText(
        buildSummary(section.id, currentConfig)
      );
      flashCopied("Copied");
    } catch {
      flashCopied("Copied");
    }
  };

  const setField = (key: string, value: unknown) => {
    updateConfig(section.id, { ...currentConfig, [key]: value });
  };

  const renderOption = (opt: Option) => {
    if (opt.kind === "choice") {
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
            value={String(currentConfig[opt.key] ?? "")}
            onChange={(e) => setField(opt.key, e.target.value)}
            className="w-full min-h-[44px] px-3 rounded-[10px] bg-sand-100 border border-sand-300 text-[14px] text-cocoa-900"
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
            checked={Boolean(currentConfig[opt.key])}
            onChange={(e) => setField(opt.key, e.target.checked)}
            className="size-5 accent-cocoa-900 cursor-pointer"
          />
        </label>
      );
    }

    if (opt.kind === "range") {
      const value = Number(currentConfig[opt.key] ?? opt.min);
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
            value={String(currentConfig[opt.key] ?? "")}
            maxLength={opt.maxLength}
            placeholder={opt.placeholder}
            onChange={(e) =>
              setField(opt.key, e.target.value.slice(0, opt.maxLength))
            }
            className="w-full min-h-[44px] px-3 rounded-[10px] bg-sand-100 border border-sand-300 text-[14px] text-cocoa-900"
          />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {!isOpen && (
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 z-50 h-11 min-h-[44px] px-5 rounded-pill bg-cocoa-900 text-cream-50 font-body text-sm font-semibold shadow-lg inline-flex items-center gap-2 hover:bg-cocoa-700 transition-colors"
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          <span>Customize</span>
        </button>
      )}

      {showPhonePreview && (
        <PhonePreview onClose={() => setShowPhonePreview(false)} />
      )}

      {isOpen && (
        <aside
          role="dialog"
          aria-modal="false"
          aria-label="Section Customizer"
          className="fixed inset-y-0 left-0 z-50 w-full sm:w-[380px] bg-cream-50 text-cocoa-900 border-r border-sand-300 shadow-2xl flex flex-col font-body text-[14px]"
        >
          <div className="px-4 py-3 border-b border-sand-300 bg-sand-100 flex items-center justify-between shrink-0">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-cocoa-700">
                Section Customizer
              </p>
              <h2 className="font-heading text-lg font-medium text-cocoa-900 leading-tight">
                {section.title}
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
              className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 transition-colors"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          {(customizerSections as readonly unknown[]).length > 1 && (
            <div className="px-4 py-2 border-b border-sand-300 flex gap-1">
              {customizerSections.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "px-3 py-1 rounded-pill text-xs font-semibold",
                    s.id === section.id
                      ? "bg-cocoa-900 text-cream-50"
                      : "text-cocoa-700"
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto divide-y divide-sand-300">
            {groups.map((group) => {
              const isGroupOpen = openGroups[group] ?? false;
              const groupOptions = section.options.filter(
                (o) => o.group === group
              );
              return (
                <div key={group} className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [group]: !isGroupOpen,
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

                      {section.id === "world-of-cocomishri" &&
                        group === "Animation" && (
                          <button
                            type="button"
                            onClick={() =>
                              window.dispatchEvent(
                                new CustomEvent("cm-world-replay")
                              )
                            }
                            className="w-full min-h-[44px] px-4 rounded-pill border border-cocoa-900 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-2 hover:bg-sand-100 transition-colors"
                          >
                            <Play size={14} strokeWidth={1.75} />
                            <span>Replay animation</span>
                          </button>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {confirmReset && (
            <div className="px-4 py-3 bg-blush-100 border-t border-sand-300 flex items-center justify-between gap-2 shrink-0">
              <span className="text-[13px] font-medium text-cocoa-900">
                Reset settings?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    resetConfig(section.id);
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
                className="min-h-[44px] px-3 rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Smartphone size={15} strokeWidth={1.5} />
                <span>Phone preview</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="min-h-[44px] px-3 rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={15} strokeWidth={1.5} />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="min-h-[44px] px-3 rounded-pill border border-sand-300 bg-cream-50 text-cocoa-900 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
              >
                <Share2 size={15} strokeWidth={1.5} />
                <span>Share link</span>
              </button>

              <button
                type="button"
                onClick={handleCopySettings}
                className="min-h-[44px] px-3 rounded-pill bg-cocoa-900 text-cream-50 text-[13px] font-semibold inline-flex items-center justify-center gap-1.5"
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
