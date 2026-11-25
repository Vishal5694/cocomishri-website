"use client";

import * as React from "react";
import { X } from "lucide-react";

interface PhonePreviewProps {
  onClose: () => void;
}

export function PhonePreview({ onClose }: PhonePreviewProps) {
  const [src, setSrc] = React.useState("");

  React.useEffect(() => {
    setSrc(window.location.href);
  }, []);

  return (
    <div
      role="region"
      aria-label="Phone preview"
      className="fixed bottom-16 left-4 z-50 w-[375px] max-w-[calc(100vw-2rem)] h-[740px] max-h-[calc(100vh-5rem)] bg-cream-50 border border-sand-300 rounded-card shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="h-11 px-4 bg-sand-100 border-b border-sand-300 flex items-center justify-between shrink-0">
        <span className="font-body text-[13px] font-semibold text-cocoa-900">
          Phone preview (375 × 740)
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close phone preview"
          className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-300/40 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {src && (
        <iframe
          src={src}
          title="Mobile preview"
          className="w-full flex-1 border-0 bg-cream-50"
        />
      )}
    </div>
  );
}
