"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { Panel } from "./Panel";
import { Button } from "@/components/ui";
import { useRecentlyViewed } from "@/lib/storage/useRecentlyViewed";
import { useFavourites } from "@/lib/storage/useFavourites";

interface AccountPanelProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
}

export function AccountPanel({ isOpen, onClose, triggerRef }: AccountPanelProps) {
  const { recentlyViewed } = useRecentlyViewed();
  const { favourites } = useFavourites();

  return (
    <Panel
      isOpen={isOpen}
      onClose={onClose}
      titleId="account-panel-heading"
      side="left"
      triggerRef={triggerRef}
      className="fixed inset-y-0 left-0 w-full sm:w-[400px] max-w-full bg-cream-50 flex flex-col overflow-hidden"
    >
      {/* Top bar with wordmark & close button */}
      <div className="h-16 px-6 border-b border-sand-300 flex items-center justify-between shrink-0">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <Image
            src="/brand/wordmark.svg"
            alt="Cocomishri"
            width={573}
            height={137}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="size-11 flex items-center justify-center rounded-pill text-cocoa-900 hover:bg-sand-100 transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
        >
          <X size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* Body content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-4">
          <h2
            id="account-panel-heading"
            className="text-xl sm:text-2xl font-heading font-medium text-cocoa-900"
          >
            Sign in to your account
          </h2>

          <Link href="/account" onClick={onClose} className="block w-full">
            <Button variant="primary" size="md" className="w-full">
              Sign in or create account
            </Button>
          </Link>

          <p className="text-xs text-cocoa-700 leading-relaxed">
            By signing in, you agree to our{" "}
            <Link
              href="/privacy"
              onClick={onClose}
              className="text-blush-700 hover:underline"
            >
              privacy policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              onClick={onClose}
              className="text-blush-700 hover:underline"
            >
              terms of service
            </Link>
            .
          </p>
        </div>

        <hr className="border-sand-300 my-6" />

        {/* Recently viewed section */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-medium text-cocoa-900">
            Recently viewed
          </h3>
          {recentlyViewed.length === 0 ? (
            <p className="text-sm text-cocoa-700">
              Pieces you look at will appear here.
            </p>
          ) : (
            <ul className="space-y-2">
              {recentlyViewed.map((id) => (
                <li key={id} className="text-sm text-cocoa-700">
                  Product {id}
                </li>
              ))}
            </ul>
          )}
        </div>

        <hr className="border-sand-300 my-6" />

        {/* Favourites section */}
        <div className="space-y-3">
          <h3 className="font-heading text-lg font-medium text-cocoa-900">
            Favourites
          </h3>
          {favourites.length === 0 ? (
            <p className="text-sm text-cocoa-700">
              Tap the heart on any piece to save it here.
            </p>
          ) : (
            <ul className="space-y-2">
              {favourites.map((id) => (
                <li key={id} className="text-sm text-cocoa-700">
                  Product {id}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Panel>
  );
}
