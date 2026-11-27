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
} from "lucide-react";
import { customizerSections, type SectionId } from "@/lib/customizer/registry";
import type { Option } from "@/lib/customizer/types";
import {
  useCustomizer,
  encodeBase64Utf8,
} from "@/lib/customizer/CustomizerContext";
import { useDepartment } from "@/lib/department/DepartmentContext";
import { departments, type DepartmentId } from "@/lib/navigation";
import {
  CAMPAIGN_IMAGE_OPTIONS,
  CAMPAIGN_LINK_OPTIONS,
  type CampaignBannerItem,
  type CampaignBannersConfig,
} from "@/lib/campaign-banners-config";
import type { ImageKey } from "@/lib/images";
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

  if (sectionId === "campaign-banners") {
    const cb = config as unknown as CampaignBannersConfig;
    lines.push("", "Banners by department:");
    for (const d of departments) {
      lines.push(`- ${d.label} (${d.id}):`);
      cb.departments[d.id]?.forEach((b, i) => {
        lines.push(
          `  ${i + 1}. "${b.title}" | btn="${b.buttonText}" (${b.href}) | img=${b.imageKey} (${b.focusX}% ${b.focusY}%) | phone=${b.phoneImageKey} (${b.phoneFocusX}% ${b.phoneFocusY}%)${b.videoSrc ? ` | video=${b.videoSrc}` : ""}`
        );
      });
    }
  }

  lines.push("", "JSON:", JSON.stringify(config, null, 2));
  return lines.join("\n");
}

export function CustomizerPanel() {
  const { configs, updateConfig, resetConfig } = useCustomizer();
  const { department, setDepartment } = useDepartment();
  const [activeSection, setActiveSection] = React.useState<SectionId>(
    customizerSections[0]?.id ?? "campaign-banners"
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [showPhonePreview, setShowPhonePreview] = React.useState(false);
  const [confirmReset, setConfirmReset] = React.useState(false);
  const [copiedMsg, setCopiedMsg] = React.useState<string | null>(null);
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({
    Banners: true,
    Layout: true,
    Text: false,
    Button: false,
    Overlays: false,
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
    const parsedVal = key === "gapPx" ? Number(value) : value;
    updateConfig(section.id, { ...currentConfig, [key]: parsedVal });
  };

  const updateDeptBanner = (
    dept: DepartmentId,
    idx: 0 | 1,
    patch: Partial<CampaignBannerItem>
  ) => {
    const cb = currentConfig as unknown as CampaignBannersConfig;
    const pair = cb.departments[dept];
    const nextPair: [CampaignBannerItem, CampaignBannerItem] = [
      idx === 0 ? { ...pair[0], ...patch } : pair[0],
      idx === 1 ? { ...pair[1], ...patch } : pair[1],
    ];
    updateConfig(section.id, {
      ...cb,
      departments: {
        ...cb.departments,
        [dept]: nextPair,
      },
    });
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

  const cbConfig =
    section.id === "campaign-banners"
      ? (currentConfig as unknown as CampaignBannersConfig)
      : null;
  const activeDeptBanners = cbConfig?.departments[department];

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
          <div className="px-4 py-3 border-b border-sand-300 bg-sand-100 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
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

            {section.id === "campaign-banners" && (
              <div
                role="tablist"
                aria-label="Department preview"
                className="grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-cream-50 border border-sand-300"
              >
                {departments.map((d) => {
                  const selected = department === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setDepartment(d.id)}
                      className={cn(
                        "min-h-[34px] px-2 rounded-pill text-[11px] font-semibold transition-colors",
                        selected
                          ? "bg-cocoa-900 text-cream-50"
                          : "text-cocoa-700 hover:text-cocoa-900"
                      )}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            )}
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
            {activeDeptBanners && (
              <div className="px-4 py-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpenGroups((prev) => ({
                      ...prev,
                      Banners: !(prev.Banners ?? true),
                    }))
                  }
                  aria-expanded={openGroups.Banners ?? true}
                  className="w-full min-h-[44px] flex items-center justify-between text-[13px] font-semibold uppercase tracking-[0.06em] text-cocoa-900 text-left"
                >
                  <span>Banners ({department})</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className={cn(
                      "transition-transform duration-200",
                      (openGroups.Banners ?? true) && "rotate-180"
                    )}
                  />
                </button>
                {(openGroups.Banners ?? true) && (
                  <div className="pb-4 pt-2 space-y-3">
                    {activeDeptBanners.map((b, idx) => {
                      const bIdx = idx as 0 | 1;
                      return (
                        <div
                          key={`${department}-${b.id}`}
                          className="p-3 rounded-[12px] bg-sand-100 border border-sand-300 space-y-2.5"
                        >
                          <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-cocoa-700">
                            Banner {idx + 1}
                          </p>
                          <div>
                            <label
                              htmlFor={`cb-title-${b.id}`}
                              className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                            >
                              Title
                            </label>
                            <input
                              id={`cb-title-${b.id}`}
                              type="text"
                              maxLength={80}
                              value={b.title}
                              onChange={(e) =>
                                updateDeptBanner(department, bIdx, {
                                  title: e.target.value.slice(0, 80),
                                })
                              }
                              className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label
                                htmlFor={`cb-btn-${b.id}`}
                                className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                              >
                                Button text
                              </label>
                              <input
                                id={`cb-btn-${b.id}`}
                                type="text"
                                maxLength={30}
                                value={b.buttonText}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    buttonText: e.target.value.slice(0, 30),
                                  })
                                }
                                className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`cb-href-${b.id}`}
                                className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                              >
                                Link
                              </label>
                              <select
                                id={`cb-href-${b.id}`}
                                value={b.href}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    href: e.target.value,
                                  })
                                }
                                className="w-full min-h-[40px] px-2 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                              >
                                {CAMPAIGN_LINK_OPTIONS.map((opt) => (
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
                                htmlFor={`cb-img-${b.id}`}
                                className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                              >
                                Desktop image
                              </label>
                              <select
                                id={`cb-img-${b.id}`}
                                value={b.imageKey}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    imageKey: e.target.value as ImageKey,
                                  })
                                }
                                className="w-full min-h-[40px] px-2 rounded-[8px] bg-cream-50 border border-sand-300 text-[12px] text-cocoa-900"
                              >
                                {CAMPAIGN_IMAGE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label
                                htmlFor={`cb-pimg-${b.id}`}
                                className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                              >
                                Phone image
                              </label>
                              <select
                                id={`cb-pimg-${b.id}`}
                                value={b.phoneImageKey}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    phoneImageKey: e.target.value as ImageKey,
                                  })
                                }
                                className="w-full min-h-[40px] px-2 rounded-[8px] bg-cream-50 border border-sand-300 text-[12px] text-cocoa-900"
                              >
                                {CAMPAIGN_IMAGE_OPTIONS.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="flex justify-between text-[11px] text-cocoa-700">
                                <label htmlFor={`cb-fx-${b.id}`}>Focus X</label>
                                <span>{b.focusX}%</span>
                              </div>
                              <input
                                id={`cb-fx-${b.id}`}
                                type="range"
                                min={0}
                                max={100}
                                value={b.focusX}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    focusX: Number(e.target.value),
                                  })
                                }
                                className="w-full accent-cocoa-900 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] text-cocoa-700">
                                <label htmlFor={`cb-fy-${b.id}`}>Focus Y</label>
                                <span>{b.focusY}%</span>
                              </div>
                              <input
                                id={`cb-fy-${b.id}`}
                                type="range"
                                min={0}
                                max={100}
                                value={b.focusY}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    focusY: Number(e.target.value),
                                  })
                                }
                                className="w-full accent-cocoa-900 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <div className="flex justify-between text-[11px] text-cocoa-700">
                                <label htmlFor={`cb-pfx-${b.id}`}>
                                  Phone X
                                </label>
                                <span>{b.phoneFocusX}%</span>
                              </div>
                              <input
                                id={`cb-pfx-${b.id}`}
                                type="range"
                                min={0}
                                max={100}
                                value={b.phoneFocusX}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    phoneFocusX: Number(e.target.value),
                                  })
                                }
                                className="w-full accent-cocoa-900 cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between text-[11px] text-cocoa-700">
                                <label htmlFor={`cb-pfy-${b.id}`}>
                                  Phone Y
                                </label>
                                <span>{b.phoneFocusY}%</span>
                              </div>
                              <input
                                id={`cb-pfy-${b.id}`}
                                type="range"
                                min={0}
                                max={100}
                                value={b.phoneFocusY}
                                onChange={(e) =>
                                  updateDeptBanner(department, bIdx, {
                                    phoneFocusY: Number(e.target.value),
                                  })
                                }
                                className="w-full accent-cocoa-900 cursor-pointer"
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor={`cb-vid-${b.id}`}
                              className="block text-[12px] font-medium text-cocoa-700 mb-0.5"
                            >
                              Preview video URL
                            </label>
                            <input
                              id={`cb-vid-${b.id}`}
                              type="text"
                              maxLength={120}
                              value={b.videoSrc}
                              placeholder="/videos/banner.mp4"
                              onChange={(e) =>
                                updateDeptBanner(department, bIdx, {
                                  videoSrc: e.target.value.slice(0, 120),
                                })
                              }
                              className="w-full min-h-[40px] px-2.5 rounded-[8px] bg-cream-50 border border-sand-300 text-[13px] text-cocoa-900"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

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
