import * as React from "react";
import { RotateCcw, Truck, ShieldCheck, Wallet } from "lucide-react";
import { formatINR, siteConfig } from "@/lib/site-config";

export function TrustStrip() {
  const trustItems = [
    {
      icon: RotateCcw,
      label: `Easy ${siteConfig.returns.windowDays}-day returns`,
    },
    {
      icon: Truck,
      label: "Free shipping on prepaid orders",
    },
    {
      icon: ShieldCheck,
      label: "Secure payments",
    },
    {
      icon: Wallet,
      label: `Cash on delivery up to ${formatINR(siteConfig.shipping.codMaxOrderValue)}`,
    },
  ];

  return (
    <section
      aria-label="Store assurances"
      className="w-full bg-cream-50 border-t border-sand-300 py-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col items-center space-y-2"
            >
              <Icon
                className="size-7 text-caramel-700 shrink-0"
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium text-cocoa-900 leading-snug">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
