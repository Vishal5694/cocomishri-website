"use client";

import * as React from "react";

export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = React.useCallback(() => {
    if (typeof window === "undefined") return serverFallback;
    return window.matchMedia(query).matches;
  }, [query, serverFallback]);

  const getServerSnapshot = React.useCallback(() => serverFallback, [serverFallback]);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
