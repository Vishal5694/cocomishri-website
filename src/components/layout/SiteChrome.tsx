"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { TopBar } from "@/components/header/TopBar";
import { SiteHeader } from "@/components/header/SiteHeader";
import { FooterV2 } from "@/components/v2/FooterV2";
import { WhatsAppButton } from "./WhatsAppButton";
import {
  CustomizerProvider,
  isCustomizerEnabled,
} from "@/lib/customizer/CustomizerContext";
import { cn } from "@/lib/utils";

const CustomizerPanel = isCustomizerEnabled
  ? dynamic(
      () =>
        import("@/components/customizer/CustomizerPanel").then(
          (m) => m.CustomizerPanel
        ),
      { ssr: false }
    )
  : null;

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;
  const isTransparentHeroRoute = normalized === "/" || normalized === "/v2";

  const content = (
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
      {CustomizerPanel ? <CustomizerPanel /> : null}
    </>
  );

  if (isCustomizerEnabled) {
    return <CustomizerProvider>{content}</CustomizerProvider>;
  }

  return content;
}
