"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import type { DepartmentId } from "@/lib/navigation";

const STORAGE_KEY = "cm_dept";
const VALID_DEPTS: readonly DepartmentId[] = [
  "baby-toddler",
  "girls",
  "boys",
  "gifting",
];

function isValidDepartment(val: string | null): val is DepartmentId {
  return val !== null && (VALID_DEPTS as readonly string[]).includes(val);
}

interface DepartmentContextValue {
  department: DepartmentId;
  setDepartment: (id: DepartmentId) => void;
}

const DepartmentContext = React.createContext<DepartmentContextValue | undefined>(
  undefined
);

export function DepartmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const [department, setDepartmentState] =
    React.useState<DepartmentId>("baby-toddler");

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalizedPath =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const isHome = normalizedPath === "/";

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    if (isHome) {
      const params = new URLSearchParams(window.location.search);
      const urlDept = params.get("dept");
      if (isValidDepartment(urlDept)) {
        setDepartmentState(urlDept);
        try {
          window.localStorage.setItem(STORAGE_KEY, urlDept);
        } catch {
          // Ignore storage errors
        }
        return;
      }
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidDepartment(stored)) {
        setDepartmentState(stored);
      }
    } catch {
      // Ignore storage errors
    }
  }, [isHome]);

  const setDepartment = React.useCallback(
    (id: DepartmentId) => {
      setDepartmentState(id);
      try {
        window.localStorage.setItem(STORAGE_KEY, id);
      } catch {
        // Ignore storage errors
      }
      if (isHome && typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("dept", id);
        window.history.replaceState(null, "", url.toString());
      }
    },
    [isHome]
  );

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment(): DepartmentContextValue {
  const ctx = React.useContext(DepartmentContext);
  if (!ctx) {
    throw new Error("useDepartment must be used within a DepartmentProvider");
  }
  return ctx;
}
