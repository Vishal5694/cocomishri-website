"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { footerColumns, footerLegal } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { Button, Input } from "@/components/ui";
import { CurrentYear } from "./CurrentYear";
import { Container } from "./Container";
import { cn } from "@/lib/utils";

const paymentMethods = ["UPI", "Cards", "Netbanking", "Cash on delivery"];

const whyCocomishriFeatures = [
  { icon: Truck, label: "Free shipping on prepaid" },
  { icon: ShieldCheck, label: "Made under our own watch" },
  { icon: RotateCcw, label: "Easy 7-day returns" },
  { icon: Sparkles, label: "Gentle on little skin" },
];

export function Footer() {
  const [openAccordions, setOpenAccordions] = React.useState<Record<string, boolean>>({});
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const toggleAccordion = (title: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsSubscribed(true);
    setEmail("");
  };

  const showLegalEntity =
    siteConfig.legal.entityName &&
    !siteConfig.legal.entityName.startsWith("PLACEHOLDER") &&
    siteConfig.legal.gstin &&
    !siteConfig.legal.gstin.startsWith("PLACEHOLDER");

  // Optional social channels
  const socialEntries: { label: string; url: string }[] = [];
  if (siteConfig.social.instagram?.url) {
    socialEntries.push({ label: "Instagram", url: siteConfig.social.instagram.url });
  }
  if (siteConfig.social.facebook?.url) {
    socialEntries.push({ label: "Facebook", url: siteConfig.social.facebook.url });
  }
  if (siteConfig.social.pinterest?.url) {
    socialEntries.push({ label: "Pinterest", url: siteConfig.social.pinterest.url });
  }
  if (siteConfig.social.youtube?.url) {
    socialEntries.push({ label: "YouTube", url: siteConfig.social.youtube.url });
  }

  return (
    <footer className="w-full bg-sand-100 text-cocoa-900 border-t border-sand-300 pt-12 lg:pt-16 pb-12 selection:bg-blush-100 selection:text-blush-700">
      <Container className="space-y-12">
        {/* ROW 1: Four link columns (SHOP, ABOUT, SUPPORT, SOCIAL) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 pb-10 border-b border-sand-300">
          {footerColumns.map((col) => {
            const isExpanded = !!openAccordions[col.title];

            return (
              <div key={col.title} className="border-b sm:border-b-0 border-sand-300 pb-4 sm:pb-0">
                {/* Mobile Accordion Toggle */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(col.title)}
                  aria-expanded={isExpanded}
                  className="w-full sm:hidden flex items-center justify-between min-h-[44px] text-left focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                >
                  <span className="eyebrow">{col.title}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className={cn(
                      "text-cocoa-500 transition-transform duration-300 ease-soft shrink-0",
                      isExpanded && "rotate-180 text-cocoa-900"
                    )}
                  />
                </button>

                {/* Desktop Title */}
                <span className="eyebrow hidden sm:block mb-4">
                  {col.title}
                </span>

                {/* Links */}
                <ul
                  className={cn(
                    "space-y-1 mt-2 sm:mt-0",
                    !isExpanded && "hidden sm:block"
                  )}
                >
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Column 4: SOCIAL */}
          <div className="border-b sm:border-b-0 border-sand-300 pb-4 sm:pb-0">
            {/* Mobile Accordion Toggle */}
            <button
              type="button"
              onClick={() => toggleAccordion("SOCIAL")}
              aria-expanded={!!openAccordions["SOCIAL"]}
              className="w-full sm:hidden flex items-center justify-between min-h-[44px] text-left focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <span className="eyebrow">SOCIAL</span>
              <ChevronDown
                size={16}
                strokeWidth={1.5}
                className={cn(
                  "text-cocoa-500 transition-transform duration-300 ease-soft shrink-0",
                  openAccordions["SOCIAL"] && "rotate-180 text-cocoa-900"
                )}
              />
            </button>

            {/* Desktop Title */}
            <span className="eyebrow hidden sm:block mb-4">SOCIAL</span>

            {/* Links */}
            <ul
              className={cn(
                "space-y-1 mt-2 sm:mt-0",
                !openAccordions["SOCIAL"] && "hidden sm:block"
              )}
            >
              {socialEntries.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ROW 2: Three blocks (Newsletter, Brand block, Why Cocomishri) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Block 1: Newsletter */}
          <div className="bg-cream-50 rounded-card p-6 border border-sand-300 flex flex-col justify-between">
            <div>
              <span className="eyebrow block mb-2">Newsletter</span>
              <h2 className="text-2xl font-heading font-medium text-cocoa-900 mb-2">
                Join our little world
              </h2>
              <p className="text-sm text-cocoa-700 mb-6">
                {siteConfig.tagline}
              </p>

              {isSubscribed ? (
                <div
                  role="alert"
                  className="p-4 rounded-[12px] bg-sand-100 border border-sand-300 text-sm font-medium text-cocoa-900"
                >
                  Thank you! Newsletter sign-ups open soon.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} noValidate className="space-y-3">
                  <Input
                    label="Email address"
                    type="email"
                    id="newsletter-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder="you@example.com"
                    error={emailError}
                  />
                  <Button type="submit" variant="primary" size="md" className="w-full">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Block 2: Brand Block */}
          <div className="bg-cream-50 rounded-card p-6 border border-sand-300 flex flex-col justify-between space-y-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2 mb-2"
              >
                <Image
                  src="/brand/wordmark.svg"
                  alt="Cocomishri"
                  width={573}
                  height={137}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="font-heading text-lg font-medium text-cocoa-900 mb-2">
                {siteConfig.logoTagline}
              </p>
              <p className="text-sm text-cocoa-700 leading-relaxed">
                {siteConfig.tagline}
              </p>
            </div>
          </div>

          {/* Block 3: Why Cocomishri */}
          <div className="bg-cream-50 rounded-card p-6 border border-sand-300 flex flex-col justify-between space-y-4">
            <div>
              <span className="eyebrow block mb-4">Why Cocomishri</span>
              <ul className="space-y-3.5">
                {whyCocomishriFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-3 text-sm text-cocoa-700">
                      <div className="size-8 rounded-pill bg-sand-100 flex items-center justify-center shrink-0 border border-sand-300 text-caramel-700">
                        <Icon size={16} strokeWidth={1.5} />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* ROW 3: Accepted Payment Pills */}
        <div className="pt-6 border-t border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs text-cocoa-700 font-medium">
            Accepted Payments:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="inline-flex items-center rounded-pill border border-sand-300 px-3 py-1 text-xs text-cocoa-700 bg-cream-50 select-none"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* BOTTOM ROW: Copyright, Legal Entity, Legal Links */}
        <div className="pt-6 border-t border-sand-300 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs text-cocoa-700">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>&copy; <CurrentYear /> Cocomishri.</span>
            {showLegalEntity && (
              <span>
                {siteConfig.legal.entityName} &middot; GSTIN {siteConfig.legal.gstin}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {footerLegal.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="min-h-[44px] inline-flex items-center hover:text-cocoa-900 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
