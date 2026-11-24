"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const isV2 = normalized === "/v2" || normalized.startsWith("/v2/");

  if (isV2) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="sticky top-0 z-40 w-full">
        <Header />
        <AnnouncementBar />
      </div>
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
