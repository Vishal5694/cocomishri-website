import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { footerColumns, footerLegal } from "@/lib/navigation";
import { siteConfig } from "@/lib/site-config";
import { CurrentYear } from "@/components/layout/CurrentYear";

export function FooterV2() {
  const showLegalEntity =
    siteConfig.legal.entityName &&
    !siteConfig.legal.entityName.startsWith("PLACEHOLDER") &&
    siteConfig.legal.gstin &&
    !siteConfig.legal.gstin.startsWith("PLACEHOLDER");

  return (
    <footer
      className="w-full p-4 lg:p-10 text-cocoa-900"
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, var(--color-sand-100), var(--color-sand-100) 16px, var(--color-sand-300) 16px, var(--color-sand-300) 32px)",
      }}
    >
      <div className="max-w-7xl mx-auto bg-cream-50 rounded-card border border-sand-300 px-6 py-10 lg:px-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-sand-300">
          {/* Left column: wordmark, tagline, email */}
          <div className="md:col-span-4 space-y-4">
            <Link
              href="/v2"
              className="inline-flex items-center min-h-[44px] focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2"
            >
              <Image
                src={asset("/brand/wordmark.svg")}
                alt="Cocomishri"
                width={573}
                height={137}
                className="h-9 w-auto object-contain"
                loading="lazy"
              />
            </Link>
            <p className="font-heading text-lg font-medium text-cocoa-900">
              {siteConfig.logoTagline}
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center min-h-[44px] text-sm font-medium text-cocoa-700 hover:text-blush-700 hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>

          {/* Middle columns: Shop / About / Support */}
          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <span className="eyebrow block mb-3">{col.title}</span>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center min-h-[44px] sm:min-h-[32px] text-sm text-cocoa-700 hover:text-cocoa-900 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right column: Instagram + mascot (80px) */}
          <div className="md:col-span-2 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-[44px] text-sm font-semibold text-blush-700 hover:underline"
            >
              {siteConfig.instagram.handle}
            </a>
            <Image
              src={asset("/brand/mascot.svg")}
              alt="Cocomishri mascot"
              width={292}
              height={231}
              className="w-20 h-20 object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Bottom row: Copyright + Legal links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cocoa-700">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
            <span>
              &copy; <CurrentYear /> {siteConfig.name}
            </span>
            {showLegalEntity && (
              <>
                <span>{siteConfig.legal.entityName}</span>
                <span>GSTIN: {siteConfig.legal.gstin}</span>
              </>
            )}
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {footerLegal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex items-center min-h-[44px] text-cocoa-700 hover:text-cocoa-900 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
