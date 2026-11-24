import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { siteConfig, formatINR } from "@/lib/site-config";
import {
  Button,
  Input,
  Badge,
  Card,
  Sparkle,
  SparkleDivider,
} from "@/components/ui";

export const metadata: Metadata = {
  title: "Design System Styleguide — Cocomishri",
  description: "Cocomishri Phase 1 Design System Tokens, Typography, and Components.",
  robots: {
    index: false,
    follow: false,
  },
};

interface ColorToken {
  name: string;
  varName: string;
  hex: string;
  bgClass: string;
  textClass: string;
  borderClass?: string;
  usage: string;
}

const colorTokens: ColorToken[] = [
  {
    name: "Cocoa 900",
    varName: "--color-cocoa-900",
    hex: "#452104",
    bgClass: "bg-cocoa-900",
    textClass: "text-cream-50",
    usage: "Headings, body text, primary button",
  },
  {
    name: "Cocoa 700",
    varName: "--color-cocoa-700",
    hex: "#6B4A35",
    bgClass: "bg-cocoa-700",
    textClass: "text-cream-50",
    usage: "Secondary text",
  },
  {
    name: "Cocoa 500",
    varName: "--color-cocoa-500",
    hex: "#8C6B55",
    bgClass: "bg-cocoa-500",
    textClass: "text-cream-50",
    usage: "Captions, input borders",
  },
  {
    name: "Blush 700",
    varName: "--color-blush-700",
    hex: "#9A4F45",
    bgClass: "bg-blush-700",
    textClass: "text-cream-50",
    usage: "Links, secondary button",
  },
  {
    name: "Blush 500",
    varName: "--color-blush-500",
    hex: "#D4917F",
    bgClass: "bg-blush-500",
    textClass: "text-cocoa-900",
    usage: "Decoration only, never text",
  },
  {
    name: "Blush 100",
    varName: "--color-blush-100",
    hex: "#F8E6DF",
    bgClass: "bg-blush-100",
    textClass: "text-cocoa-900",
    borderClass: "border border-sand-300",
    usage: "Soft section bg, badges",
  },
  {
    name: "Caramel 700",
    varName: "--color-caramel-700",
    hex: "#94521F",
    bgClass: "bg-caramel-700",
    textClass: "text-cream-50",
    usage: "Small-caps labels, icons",
  },
  {
    name: "Caramel 500",
    varName: "--color-caramel-500",
    hex: "#D18F5A",
    bgClass: "bg-caramel-500",
    textClass: "text-cocoa-900",
    usage: "Decoration only, never text",
  },
  {
    name: "Caramel 100",
    varName: "--color-caramel-100",
    hex: "#F7E8D8",
    bgClass: "bg-caramel-100",
    textClass: "text-cocoa-900",
    borderClass: "border border-sand-300",
    usage: "Alt section bg, image placeholders",
  },
  {
    name: "Sage 700",
    varName: "--color-sage-700",
    hex: "#56633A",
    bgClass: "bg-sage-700",
    textClass: "text-cream-50",
    usage: "In stock / tag text",
  },
  {
    name: "Sage 500",
    varName: "--color-sage-500",
    hex: "#98A865",
    bgClass: "bg-sage-500",
    textClass: "text-cocoa-900",
    usage: "Decoration only, never text",
  },
  {
    name: "Sage 100",
    varName: "--color-sage-100",
    hex: "#EEF0DF",
    bgClass: "bg-sage-100",
    textClass: "text-cocoa-900",
    borderClass: "border border-sand-300",
    usage: "Tag bg",
  },
  {
    name: "Cream 50",
    varName: "--color-cream-50",
    hex: "#FCF8F2",
    bgClass: "bg-cream-50",
    textClass: "text-cocoa-900",
    borderClass: "border border-sand-300",
    usage: "Page background",
  },
  {
    name: "Sand 100",
    varName: "--color-sand-100",
    hex: "#F4EADD",
    bgClass: "bg-sand-100",
    textClass: "text-cocoa-900",
    borderClass: "border border-sand-300",
    usage: "Cards, footer, input bg",
  },
  {
    name: "Sand 300",
    varName: "--color-sand-300",
    hex: "#E3CFB6",
    bgClass: "bg-sand-300",
    textClass: "text-cocoa-900",
    borderClass: "border border-sand-300",
    usage: "Dividers, card outlines",
  },
  {
    name: "Amber 500",
    varName: "--color-amber-500",
    hex: "#D27821",
    bgClass: "bg-amber-500",
    textClass: "text-cocoa-900",
    usage: "Tiny sparkle icon only",
  },
];

export default function StyleguidePage() {
  return (
    <>
      <meta name="robots" content="noindex" />
      <div className="min-h-screen bg-cream-50 text-cocoa-900 selection:bg-blush-100 selection:text-blush-700">
        {/* Styleguide Header Banner */}
        <div className="border-b border-sand-300 bg-sand-100/60 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0 flex items-center">
                <Image
                  src={asset("/brand/wordmark.svg")}
                  alt="Cocomishri"
                  width={573}
                  height={137}
                  className="h-8 md:h-10 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="eyebrow">Design System · Phase 1</span>
                  <Badge variant="new">v1.0.0</Badge>
                </div>
                <h1 className="mt-1">Cocomishri Styleguide</h1>
                <p className="text-cocoa-700 text-sm mt-1">
                  {siteConfig.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center min-h-[44px] text-sm font-medium text-blush-700 hover:underline"
              >
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          {/* Section A: Colours */}
          <section id="colours" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Palette Tokens</span>
              <h2>Colours</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                16 tokens from the Cocomishri logo. No pure black or white.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {colorTokens.map((token) =>
                token.varName === "--color-amber-500" ? (
                  <div
                    key={token.varName}
                    className="rounded-card overflow-hidden border border-sand-300 bg-cream-50 text-cocoa-900 transition-transform duration-300 ease-soft hover:-translate-y-0.5 flex flex-col"
                  >
                    <div className="h-12 w-full bg-amber-500 shrink-0" />
                    <div className="p-4 flex flex-col flex-1 justify-between bg-cream-50 text-cocoa-900">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-base leading-tight">
                          {token.name}
                        </span>
                        <span className="font-mono font-semibold text-xs">
                          {token.hex}
                        </span>
                      </div>
                      <div className="mt-4 pt-3 border-t border-sand-300 space-y-1">
                        <p className="font-mono font-medium text-[11px]">
                          {token.varName}
                        </p>
                        <p className="leading-snug font-medium text-[11.5px]">
                          {token.usage}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={token.varName}
                    className={`rounded-card p-4 transition-transform duration-300 ease-soft hover:-translate-y-0.5 ${token.bgClass} ${token.textClass} ${token.borderClass || ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-base leading-tight">
                        {token.name}
                      </span>
                      <span className="font-mono font-semibold text-xs">
                        {token.hex}
                      </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-current/20 space-y-1">
                      <p className="font-mono font-medium text-[11px]">
                        {token.varName}
                      </p>
                      <p className="leading-snug font-medium text-[11.5px]">
                        {token.usage}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>

          <SparkleDivider sparkleSize={16} />

          {/* Section B: Typography */}
          <section id="typography" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Scale &amp; Hierarchy</span>
              <h2>Typography</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                Headings in Fraunces (Variable Soft 75, weight 500), body and UI in Nunito Sans.
                Responsive scale adapts seamlessly from mobile to desktop.
              </p>
            </div>

            <Card bordered className="space-y-6">
              <div className="border-b border-sand-300 pb-5">
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  H1 · Mobile 36px &rarr; Desktop 56px · Line Height 1.2
                </span>
                <p className="h1-style">A little world called Cocomishri</p>
              </div>

              <div className="border-b border-sand-300 pb-5">
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  H2 · Mobile 28px &rarr; Desktop 40px · Line Height 1.2
                </span>
                <p className="h2-style">Made under our own watch</p>
              </div>

              <div className="border-b border-sand-300 pb-5">
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  H3 · Mobile 22px &rarr; Desktop 28px · Line Height 1.2
                </span>
                <p className="h3-style">Soft, breathable and gentle on skin</p>
              </div>

              <div className="border-b border-sand-300 pb-5">
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  Body · Mobile 16px &rarr; Desktop 17px · Line Height 1.6
                </span>
                <p>
                  Named after our daughter, our little Mishri, Cocomishri began with a simple wish: soft, beautiful clothes for her special day, without the scratchy shimmer or the unfair price tag.
                </p>
              </div>

              <div className="border-b border-sand-300 pb-5">
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  Small · 14px · Line Height 1.5
                </span>
                <small className="text-cocoa-700 block">
                  Free shipping on all prepaid orders.
                </small>
              </div>

              <div className="border-b border-sand-300 pb-5">
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  Eyebrow · 12–13px · Uppercase · Tracking 0.08em · Caramel 700
                </span>
                <span className="eyebrow block">Naming ceremony</span>
              </div>

              <div>
                <span className="text-xs font-mono font-medium text-cocoa-700 block mb-2">
                  Link · Blush 700 · Underline on Hover · Focus Ring
                </span>
                <p>
                  <Link href="#typography" className="font-medium inline-flex items-center min-h-[44px]">
                    Read our story &rarr;
                  </Link>
                </p>
              </div>
            </Card>
          </section>

          <SparkleDivider sparkleSize={16} />

          {/* Section C: Buttons */}
          <section id="buttons" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Interactive Elements</span>
              <h2>Buttons</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                Primary, secondary, and ghost variants in three sizes. All tap targets are accessible with minimum
                44px height for md and lg.
              </p>
            </div>

            <div className="space-y-6">
              {/* Primary */}
              <Card bordered className="space-y-4">
                <div className="flex items-center justify-between border-b border-sand-300 pb-3">
                  <h3>Primary Variant</h3>
                  <span className="text-xs font-mono font-medium text-cocoa-700">
                    bg cocoa-900 · text cream-50 · hover cocoa-700
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" size="sm">
                    Small Button
                  </Button>
                  <Button variant="primary" size="md">
                    Medium Button
                  </Button>
                  <Button variant="primary" size="lg">
                    Large Button
                  </Button>
                  <Button variant="primary" size="md" disabled>
                    Disabled
                  </Button>
                  <Button variant="primary" size="md" loading>
                    Loading
                  </Button>
                </div>
              </Card>

              {/* Secondary */}
              <Card bordered className="space-y-4">
                <div className="flex items-center justify-between border-b border-sand-300 pb-3">
                  <h3>Secondary Variant</h3>
                  <span className="text-xs font-mono font-medium text-cocoa-700">
                    transparent bg · 1.5px border blush-700 · text blush-700 · hover blush-100
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="secondary" size="sm">
                    Small Button
                  </Button>
                  <Button variant="secondary" size="md">
                    Medium Button
                  </Button>
                  <Button variant="secondary" size="lg">
                    Large Button
                  </Button>
                  <Button variant="secondary" size="md" disabled>
                    Disabled
                  </Button>
                  <Button variant="secondary" size="md" loading>
                    Loading
                  </Button>
                </div>
              </Card>

              {/* Ghost */}
              <Card bordered className="space-y-4">
                <div className="flex items-center justify-between border-b border-sand-300 pb-3">
                  <h3>Ghost Variant</h3>
                  <span className="text-xs font-mono font-medium text-cocoa-700">
                    transparent bg · text cocoa-900 · hover sand-100
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="ghost" size="sm">
                    Small Button
                  </Button>
                  <Button variant="ghost" size="md">
                    Medium Button
                  </Button>
                  <Button variant="ghost" size="lg">
                    Large Button
                  </Button>
                  <Button variant="ghost" size="md" disabled>
                    Disabled
                  </Button>
                  <Button variant="ghost" size="md" loading>
                    Loading
                  </Button>
                  <Button variant="ghost" size="md" href="#buttons">
                    Link as Button
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          <SparkleDivider sparkleSize={16} />

          {/* Section D: Inputs */}
          <section id="inputs" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Form Controls</span>
              <h2>Inputs</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                48px tall input fields with 12px border radius, visible labels, and accessible states.
              </p>
            </div>

            <Card bordered className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Parent / Guardian Name"
                  id="styleguide-input-default"
                  placeholder="e.g. Ananya Sharma"
                  defaultValue=""
                />
              </div>

              <div>
                <Input
                  label="Email for Order Updates"
                  id="styleguide-input-helper"
                  type="email"
                  placeholder="care@cocomishri.com"
                  helperText="We will send tracking details to this email."
                />
              </div>

              <div>
                <Input
                  label="Phone / WhatsApp Number"
                  id="styleguide-input-error"
                  type="tel"
                  placeholder="10-digit number"
                  defaultValue="9876"
                  error="Please enter a valid 10-digit phone number."
                />
              </div>
            </Card>
          </section>

          <SparkleDivider sparkleSize={16} />

          {/* Section E: Badges */}
          <section id="badges" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Status &amp; Categorization</span>
              <h2>Badges</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                Pill badges with 12px text, 4px 10px padding, and dedicated semantic palettes.
              </p>
            </div>

            <Card bordered className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <Badge variant="stock">In stock</Badge>
                <span className="text-xs text-cocoa-700">Stock (sage-100 / sage-700)</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="new">New</Badge>
                <span className="text-xs text-cocoa-700">New (blush-100 / blush-700)</span>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant="label">Naming ceremony</Badge>
                <span className="text-xs text-cocoa-700">Label (caramel-100 / caramel-700)</span>
              </div>
            </Card>
          </section>

          <SparkleDivider sparkleSize={16} />

          {/* Section F: Cards */}
          <section id="cards" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Content Containers</span>
              <h2>Cards</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                Background sand-100, 16px radius, responsive padding (16px mobile, 24px desktop), optional sand-300 border.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product Card Example as required by prompt */}
              <Card bordered className="flex flex-col justify-between">
                <div>
                  {/* Caramel-100 image placeholder (radius-image: 24px) */}
                  <div className="w-full aspect-[4/3] rounded-image bg-caramel-100 flex items-center justify-center p-6 text-center border border-sand-300">
                    <span className="text-sm text-caramel-700 font-medium">
                      Product photo
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="new">New</Badge>
                    <Badge variant="stock">In stock</Badge>
                  </div>

                  <h3 className="mt-3 text-cocoa-900">
                    Sample product name
                  </h3>

                  <p className="text-sm font-medium text-cocoa-700 mt-2">
                    ₹ — incl. of all taxes
                  </p>

                  <p className="text-xs text-cocoa-700 mt-1">
                    Sizes: 0–6M, 6–12M, 1–2Y
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sand-300 flex items-center gap-3">
                  <Button variant="primary" size="md" className="flex-1">
                    Add to Bag
                  </Button>
                  <Button variant="secondary" size="md">
                    Wishlist
                  </Button>
                </div>
              </Card>

              {/* Brand Card */}
              <Card bordered className="flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="eyebrow block">Our story</span>
                  <h3>Sweet like Mishri. Soft like a hug.</h3>
                  <p className="text-sm text-cocoa-700">
                    Every piece is made under our own watch. We ask one question each time: would we put this on our Mishri?
                  </p>
                </div>

                <div className="mt-6">
                  <Button variant="ghost" size="md" className="w-full">
                    Read our story &rarr;
                  </Button>
                </div>
              </Card>

              {/* Shipping & Returns Card */}
              <Card bordered className="flex flex-col justify-between">
                <div className="space-y-4">
                  <Badge variant="label">Shipping</Badge>
                  <h3>Shipping &amp; returns</h3>
                  <ul className="text-xs text-cocoa-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <Sparkle size={12} />
                      Prepaid orders: {siteConfig.shipping.prepaidFree ? "Free shipping" : "Standard rates apply"}
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkle size={12} />
                      COD: {formatINR(siteConfig.shipping.codFee)} (up to {formatINR(siteConfig.shipping.codMaxOrderValue)})
                    </li>
                    <li className="flex items-center gap-2">
                      <Sparkle size={12} />
                      {siteConfig.returns.windowDays}-day returns
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <Button variant="secondary" size="md" className="w-full">
                    View Shipping Guide
                  </Button>
                </div>
              </Card>
            </div>
          </section>

          <SparkleDivider sparkleSize={16} />

          {/* Section G: Sparkle */}
          <section id="sparkles" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Brand Motif</span>
              <h2>Sparkle Dividers &amp; Icons</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                Tiny 4-point star SVG icon in amber-500 (#D27821), aria-hidden, used as decorative dividers and accents.
              </p>
            </div>

            <Card bordered className="space-y-6">
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-card bg-cream-50 border border-sand-300 flex items-center justify-center">
                    <Sparkle size={12} />
                  </div>
                  <div>
                    <span className="font-medium text-sm block">12px Sparkle</span>
                    <span className="text-xs text-cocoa-700 font-mono">size=12</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-card bg-cream-50 border border-sand-300 flex items-center justify-center">
                    <Sparkle size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-sm block">16px Sparkle</span>
                    <span className="text-xs text-cocoa-700 font-mono">size=16</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-card bg-cream-50 border border-sand-300 flex items-center justify-center">
                    <Sparkle size={20} />
                  </div>
                  <div>
                    <span className="font-medium text-sm block">20px Sparkle</span>
                    <span className="text-xs text-cocoa-700 font-mono">size=20</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-sand-300 space-y-4">
                <span className="text-xs font-mono font-medium text-cocoa-700 block">
                  Horizontal Divider with sand-300 line &amp; amber-500 sparkle
                </span>
                <SparkleDivider sparkleSize={20} />
              </div>
            </Card>
          </section>

          {/* Brand Assets Showcase */}
          <section id="brand-assets" className="space-y-6">
            <div>
              <span className="eyebrow block mb-2">Vector Identity</span>
              <h2>Brand Assets</h2>
              <p className="text-cocoa-700 text-sm mt-1 max-w-2xl">
                Kebab-cased SVG assets in public/brand/: full-logo.svg, wordmark.svg, mascot.svg.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card bordered className="flex flex-col items-center text-center p-6">
                <div className="w-full h-28 flex items-center justify-center bg-cream-50 rounded-card border border-sand-300 p-4">
                  <Image
                    src={asset("/brand/full-logo.svg")}
                    alt="Cocomishri Full Logo"
                    width={573}
                    height={377}
                    className="max-h-20 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="font-medium text-sm mt-4">Full Logo</span>
                <span className="text-xs text-cocoa-700 font-mono">/brand/full-logo.svg</span>
              </Card>

              <Card bordered className="flex flex-col items-center text-center p-6">
                <div className="w-full h-28 flex items-center justify-center bg-cream-50 rounded-card border border-sand-300 p-4">
                  <Image
                    src={asset("/brand/wordmark.svg")}
                    alt="Cocomishri Wordmark"
                    width={573}
                    height={137}
                    className="max-h-12 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="font-medium text-sm mt-4">Wordmark</span>
                <span className="text-xs text-cocoa-700 font-mono">/brand/wordmark.svg</span>
              </Card>

              <Card bordered className="flex flex-col items-center text-center p-6">
                <div className="w-full h-28 flex items-center justify-center bg-cream-50 rounded-card border border-sand-300 p-4">
                  <Image
                    src={asset("/brand/mascot.svg")}
                    alt="Cocomishri Mascot"
                    width={292}
                    height={231}
                    className="max-h-20 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <span className="font-medium text-sm mt-4">Mascot</span>
                <span className="text-xs text-cocoa-700 font-mono">/brand/mascot.svg</span>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
