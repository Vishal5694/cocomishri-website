"use client";

import * as React from "react";
import {
  customizerSections,
  homeHeroSection,
  siteHeaderSection,
  type SectionId,
} from "./registry";
import { DEFAULT_HERO_CONFIG, type HeroConfig } from "@/lib/hero-config";
import { DEFAULT_HEADER_CONFIG, type HeaderConfig } from "@/lib/header-config";

const STORAGE_KEY = "cm_customizer_v1";

export const isCustomizerEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CUSTOMIZER === "true";

export type ConfigMap = {
  "home-hero": HeroConfig;
  "site-header": HeaderConfig;
};

interface CustomizerContextValue {
  configs: ConfigMap;
  updateConfig: <K extends keyof ConfigMap>(
    sectionId: K,
    next: ConfigMap[K]
  ) => void;
  resetConfig: (sectionId: keyof ConfigMap) => void;
}

const DEFAULT_MAP: ConfigMap = {
  "home-hero": DEFAULT_HERO_CONFIG,
  "site-header": DEFAULT_HEADER_CONFIG,
};

const CustomizerContext = React.createContext<CustomizerContextValue>({
  configs: DEFAULT_MAP,
  updateConfig: () => {},
  resetConfig: () => {},
});

function decodeBase64Utf8(b64: string): string {
  const binary = window.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function CustomizerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [configs, setConfigs] = React.useState<ConfigMap>(DEFAULT_MAP);

  const persist = React.useCallback((nextMap: ConfigMap) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
    } catch {
      // Ignore storage errors
    }
  }, []);

  React.useEffect(() => {
    if (!isCustomizerEnabled || typeof window === "undefined") return;

    // 1. Check #cm= hash first
    const hash = window.location.hash;
    if (hash.startsWith("#cm=")) {
      const payload = hash.slice(4);
      // Always clean hash from URL
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      try {
        const decoded = decodeBase64Utf8(decodeURIComponent(payload));
        const parsed = JSON.parse(decoded) as Record<string, unknown>;
        const nextMap: ConfigMap = { ...DEFAULT_MAP };
        if (
          parsed &&
          typeof parsed === "object" &&
          ("home-hero" in parsed || "site-header" in parsed)
        ) {
          if ("home-hero" in parsed) {
            nextMap["home-hero"] = homeHeroSection.validate(parsed["home-hero"]);
          }
          if ("site-header" in parsed) {
            nextMap["site-header"] = siteHeaderSection.validate(
              parsed["site-header"]
            );
          }
        } else {
          nextMap["home-hero"] = homeHeroSection.validate(parsed);
        }
        setConfigs(nextMap);
        persist(nextMap);
        return;
      } catch {
        // Broken hash/JSON falls back cleanly to defaults/storage
      }
    }

    // 2. Load from localStorage
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const nextMap: ConfigMap = { ...DEFAULT_MAP };
        if (parsed && typeof parsed === "object") {
          if ("home-hero" in parsed) {
            nextMap["home-hero"] = homeHeroSection.validate(parsed["home-hero"]);
          }
          if ("site-header" in parsed) {
            nextMap["site-header"] = siteHeaderSection.validate(
              parsed["site-header"]
            );
          }
        }
        setConfigs(nextMap);
      }
    } catch {
      // Ignore broken storage JSON
    }
  }, [persist]);

  // Listen to storage events for live PhonePreview iframe sync
  React.useEffect(() => {
    if (!isCustomizerEnabled || typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (!e.newValue) {
        setConfigs(DEFAULT_MAP);
        return;
      }
      try {
        const parsed = JSON.parse(e.newValue) as Record<string, unknown>;
        const nextMap: ConfigMap = { ...DEFAULT_MAP };
        if (parsed && typeof parsed === "object") {
          if ("home-hero" in parsed) {
            nextMap["home-hero"] = homeHeroSection.validate(parsed["home-hero"]);
          }
          if ("site-header" in parsed) {
            nextMap["site-header"] = siteHeaderSection.validate(
              parsed["site-header"]
            );
          }
        }
        setConfigs(nextMap);
      } catch {
        // Ignore broken storage
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateConfig = React.useCallback(
    <K extends keyof ConfigMap>(sectionId: K, next: ConfigMap[K]) => {
      if (!isCustomizerEnabled) return;
      const validated =
        sectionId === "home-hero"
          ? (homeHeroSection.validate(next) as ConfigMap[K])
          : (siteHeaderSection.validate(next) as ConfigMap[K]);
      setConfigs((prev) => {
        const nextMap = { ...prev, [sectionId]: validated };
        persist(nextMap);
        return nextMap;
      });
    },
    [persist]
  );

  const resetConfig = React.useCallback(
    (sectionId: keyof ConfigMap) => {
      if (!isCustomizerEnabled) return;
      setConfigs((prev) => {
        const nextMap = { ...prev, [sectionId]: DEFAULT_MAP[sectionId] };
        persist(nextMap);
        return nextMap;
      });
    },
    [persist]
  );

  return (
    <CustomizerContext.Provider value={{ configs, updateConfig, resetConfig }}>
      {children}
    </CustomizerContext.Provider>
  );
}

export function useSectionConfig<K extends keyof ConfigMap>(
  sectionId: K
): ConfigMap[K] {
  const ctx = React.useContext(CustomizerContext);
  if (!isCustomizerEnabled) {
    return DEFAULT_MAP[sectionId];
  }
  return ctx.configs[sectionId] ?? DEFAULT_MAP[sectionId];
}

export function useCustomizer() {
  return React.useContext(CustomizerContext);
}
