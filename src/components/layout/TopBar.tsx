import * as React from "react";
import { siteConfig } from "@/lib/site-config";

export function TopBar() {
  const message = siteConfig.announcements[0];
  if (!message) return null;

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="fixed top-0 left-0 right-0 z-40 h-8 bg-caramel-100 text-cocoa-900 flex items-center justify-center px-4 text-center"
    >
      <p className="text-[13px] font-medium leading-none truncate">
        {message}
      </p>
    </div>
  );
}
