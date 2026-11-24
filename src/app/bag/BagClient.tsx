"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/Container";
import { usePanel } from "@/lib/ui/PanelContext";
import { useRecentlyViewed } from "@/lib/storage/useRecentlyViewed";

export function BagClient() {
  const { open } = usePanel();
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <div className="w-full py-16 lg:py-24">
      <Container className="flex flex-col items-center text-center space-y-6">
        <h1 className="font-heading text-[36px] leading-[1.2] font-medium text-cocoa-900">
          Your bag is empty
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary">Continue shopping</Button>
          </Link>
          <Button
            variant="secondary"
            onClick={(e) => open("account", e.currentTarget)}
          >
            Sign in
          </Button>
        </div>

        {recentlyViewed.length > 0 && (
          <div className="w-full pt-12 mt-8 border-t border-sand-300 space-y-4">
            <span className="eyebrow block">RECENTLY VIEWED</span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {recentlyViewed.map((id) => (
                <Link
                  key={id}
                  href={`/products/${id}`}
                  className="min-h-[44px] px-4 rounded-pill border border-sand-300 inline-flex items-center text-sm font-medium text-cocoa-900 hover:bg-sand-100"
                >
                  {id}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
