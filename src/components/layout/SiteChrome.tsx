"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/header/TopBar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { FooterV2 } from "@/components/v2/FooterV2";
import { WhatsAppButton } from "./WhatsAppButton";
import { cn } from "@/lib/utils";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const isTransparentHeroRoute = normalized === "/" || normalized === "/v2";

  return (
    <>
      <TopBar />
      <SiteHeader />
      <main
        id="main"
        className={cn(
          "flex-1",
          !isTransparentHeroRoute && "pt-16 lg:pt-[72px]"
        )}
      >
        {children}
      </main>
      <FooterV2 />
      <WhatsAppButton />
    </>
  );
}
