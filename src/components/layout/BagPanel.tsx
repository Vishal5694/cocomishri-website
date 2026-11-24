"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Panel } from "./Panel";
import { useCartCount } from "@/lib/cart/useCartCount";
import { getRecommendations } from "@/lib/cart/getRecommendations";
import { siteConfig } from "@/lib/site-config";

interface BagPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
}

export function BagPanel({ isOpen, onClose, triggerRef }: BagPanelProps) {
  const cartCount = useCartCount();
  const recommendations = getRecommendations();

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      titleId="bag-panel-heading"
      side="right"
      triggerRef={triggerRef}
      className="fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-full bg-cream-50 flex flex-col overflow-hidden"
    >
      {/* Header row: H2 "Your bag" + item count "(0)" + close button */}
      <div className="h-16 px-6 border-b border-sand-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h2
            id="bag-panel-heading"
            className="font-heading text-xl sm:text-2xl font-medium text-cocoa-900"
          >
            Your bag
          </h2>
          <span className="text-sm font-semibold text-cocoa-700">
            ({cartCount})
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* Empty state (centred): Fraunces 22px "Your bag is empty", then a text link "Continue shopping →" to /shop */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center text-center space-y-4">
        {cartCount === 0 ? (
          <div className="space-y-3">
            <p className="font-heading text-[22px] font-medium text-cocoa-900">
              Your bag is empty
            </p>
            <Link
              href="/shop"
              onClick={onClose}
              className="text-base font-semibold text-blush-700 hover:underline min-h-[44px] inline-flex items-center transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              Continue shopping &rarr;
            </Link>
          </div>
        ) : null}

        {/* "You may also like" section: render ONLY when not empty */}
        {recommendations.length > 0 && (
          <div className="w-full pt-8 border-t border-sand-300 space-y-4 text-left">
            <span className="eyebrow block">You may also like</span>
            <div className="space-y-2">
              {recommendations.map((item) => (
                <div key={item.id} className="p-3 bg-sand-100 rounded-card">
                  <p className="text-sm font-medium text-cocoa-900">{item.title}</p>
                  <p className="text-xs text-cocoa-700">{item.priceFormatted}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom strip (sand-100, pinned to panel bottom): small text "Free shipping on all prepaid orders" */}
      <div className="bg-sand-100 border-t border-sand-300 p-4 text-center shrink-0">
        <p className="text-sm text-cocoa-700 font-medium">
          {siteConfig.announcements[0]}
        </p>
      </div>
    </Panel>
  );
}
