"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { useSectionConfig } from "@/lib/customizer/CustomizerContext";

export function WhatsAppButton() {
  const cfg = useSectionConfig("site-header");
  const isAvailable =
    cfg.whatsappOn &&
    siteConfig.whatsapp &&
    !siteConfig.whatsapp.startsWith("PLACEHOLDER");

  if (!isAvailable) return null;

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-[88px] z-40 size-14 rounded-pill bg-sage-700 text-cream-50 flex items-center justify-center shadow-lg hover:opacity-95 transition-all duration-300 ease-soft focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
    >
      <MessageCircle size={26} strokeWidth={1.5} />
    </a>
  );
}
