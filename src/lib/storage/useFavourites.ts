"use client";

import * as React from "react";

const STORAGE_KEY = "cocomishri_favourites";
const EMPTY_ITEMS: string[] = [];

let cachedRaw: string | null = null;
let cachedItems: string[] = EMPTY_ITEMS;

function getSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedItems;
    cachedRaw = raw;
    if (!raw) {
      cachedItems = EMPTY_ITEMS;
      return cachedItems;
    }
    const parsed = JSON.parse(raw);
    cachedItems = Array.isArray(parsed) ? parsed : EMPTY_ITEMS;
    return cachedItems;
  } catch {
    return EMPTY_ITEMS;
  }
}

function getServerSnapshot(): string[] {
  return EMPTY_ITEMS;
}

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedRaw = null;
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function notify() {
  cachedRaw = null;
  listeners.forEach((listener) => listener());
}

function setStoredItems(items: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    notify();
  } catch {
    // Ignore storage quota or permission errors
  }
}

export function useFavourites() {
  const items = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavourite = React.useCallback((id: string) => {
    const current = getSnapshot();
    const exists = current.includes(id);
    const next = exists ? current.filter((item) => item !== id) : [...current, id];
    setStoredItems(next);
  }, []);

  const isFavourite = React.useCallback(
    (id: string) => items.includes(id),
    [items]
  );

  return {
    favourites: items,
    toggleFavourite,
    isFavourite,
  };
}
