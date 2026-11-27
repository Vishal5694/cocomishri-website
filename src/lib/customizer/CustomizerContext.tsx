"use client";

import * as React from "react";
import { customizerSections, type SectionId } from "./registry";

const STORAGE_KEY = "cm_customizer_v1";

export const isCustomizerEnabled =
  process.env.NEXT_PUBLIC_ENABLE_CUSTOMIZER === "true";

export type ConfigMap = Record<string, unknown>;

interface CustomizerContextValue {
  configs: ConfigMap;
  updateConfig: (sectionId: SectionId, next: unknown) => void;
  resetConfig: (sectionId: SectionId) => void;
}

function buildDefaultMap(): ConfigMap {
  const map: ConfigMap = {};
  for (const sec of customizerSections) {
    map[sec.id] = sec.defaults;
  }
  return map;
}

const DEFAULT_MAP: ConfigMap = buildDefaultMap();

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

function stripLockedKeys(raw: Record<string, unknown>): {
  cleaned: ConfigMap;
  hadLockedKeys: boolean;
} {
  const hadLockedKeys = "home-hero" in raw || "site-header" in raw;
  const cleaned: ConfigMap = {};
  for (const sec of customizerSections) {
    cleaned[sec.id] =
      sec.id in raw ? sec.validate(raw[sec.id]) : sec.defaults;
  }
  return { cleaned, hadLockedKeys };
}

export function CustomizerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [configs, setConfigs] = React.useState<ConfigMap>(DEFAULT_MAP);

  const persist = React.useCallback((nextMap: ConfigMap) => {
    try {
      if (Object.keys(nextMap).length === 0) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMap));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  React.useEffect(() => {
    if (!isCustomizerEnabled || typeof window === "undefined") return;

    // 1. Check #cm= hash (ignore locked 'home-hero' and 'site-header')
    const hash = window.location.hash;
    if (hash.startsWith("#cm=")) {
      const payload = hash.slice(4);
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      try {
        const decoded = decodeBase64Utf8(decodeURIComponent(payload));
        const parsed = JSON.parse(decoded);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const { cleaned } = stripLockedKeys(
            parsed as Record<string, unknown>
          );
          setConfigs(cleaned);
          persist(cleaned);
          return;
        }
      } catch {
        // Broken hash/JSON falls back cleanly
      }
    }

    // 2. Load from localStorage and delete any locked 'home-hero' or 'site-header' data
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const { cleaned, hadLockedKeys } = stripLockedKeys(
            parsed as Record<string, unknown>
          );
          setConfigs(cleaned);
          if (hadLockedKeys) {
            persist(cleaned);
          }
        }
      }
    } catch {
      // Ignore broken storage JSON
    }
  }, [persist]);

  React.useEffect(() => {
    if (!isCustomizerEnabled || typeof window === "undefined") return;

    const handleStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      if (!e.newValue) {
        setConfigs(DEFAULT_MAP);
        return;
      }
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const { cleaned } = stripLockedKeys(
            parsed as Record<string, unknown>
          );
          setConfigs(cleaned);
        }
      } catch {
        // Ignore broken storage
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateConfig = React.useCallback(
    (sectionId: SectionId, next: unknown) => {
      if (!isCustomizerEnabled) return;
      const sec = customizerSections.find((s) => s.id === sectionId);
      if (!sec) return;
      const validated = sec.validate(next);
      setConfigs((prev) => {
        const nextMap = { ...prev, [sectionId]: validated };
        persist(nextMap);
        return nextMap;
      });
    },
    [persist]
  );

  const resetConfig = React.useCallback(
    (sectionId: SectionId) => {
      if (!isCustomizerEnabled) return;
      const sec = customizerSections.find((s) => s.id === sectionId);
      if (!sec) return;
      setConfigs((prev) => {
        const nextMap = { ...prev, [sectionId]: sec.defaults };
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

export function useSectionConfig<T = unknown>(sectionId: SectionId): T | undefined {
  const ctx = React.useContext(CustomizerContext);
  if (!isCustomizerEnabled) {
    return DEFAULT_MAP[sectionId] as T | undefined;
  }
  return (ctx.configs[sectionId] ?? DEFAULT_MAP[sectionId]) as T | undefined;
}

export function useCustomizer() {
  return React.useContext(CustomizerContext);
}
