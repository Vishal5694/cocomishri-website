"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export type PanelType = "search" | "account" | "bag" | "mobile-menu" | null;

interface PanelContextValue {
  activePanel: PanelType;
  open: (name: PanelType, triggerEl?: HTMLElement | null) => void;
  close: () => void;
  triggerElement: HTMLElement | null;
}

const PanelContext = React.createContext<PanelContextValue | undefined>(undefined);

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [activePanel, setActivePanel] = React.useState<PanelType>(null);
  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = React.useState(pathname);

  // Close on route change
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (activePanel !== null) {
      setActivePanel(null);
    }
  }

  const open = React.useCallback((name: PanelType, triggerEl?: HTMLElement | null) => {
    if (triggerEl) {
      setTriggerElement(triggerEl);
    }
    setActivePanel(name);
  }, []);

  const close = React.useCallback(() => {
    setActivePanel(null);
  }, []);

  return (
    <PanelContext.Provider value={{ activePanel, open, close, triggerElement }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const context = React.useContext(PanelContext);
  if (!context) {
    throw new Error("usePanel must be used within a PanelProvider");
  }
  return context;
}
