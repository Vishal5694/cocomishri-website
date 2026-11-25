import * as React from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { getBrandHex, type LogoColorKey } from "@/lib/brand-colors";
import type { LogoVariant } from "@/lib/header-config";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: LogoVariant;
  color?: LogoColorKey;
  heightMobile?: number;
  heightDesktop?: number;
  className?: string;
  asPreview?: boolean;
  focusClassName?: string;
}

const SVG_SPECS = {
  wordmark: {
    src: "/brand/wordmark.svg",
    width: 573,
    height: 137,
    ratio: "573 / 137",
  },
  full: {
    src: "/brand/full-logo.svg",
    width: 573,
    height: 377,
    ratio: "573 / 377",
  },
  mascot: {
    src: "/brand/mascot.svg",
    width: 292,
    height: 231,
    ratio: "292 / 231",
  },
} as const;

function SvgGraphic({
  spec,
  color,
  heightVar,
  multiplier = 1,
  alt,
}: {
  spec: (typeof SVG_SPECS)[keyof typeof SVG_SPECS];
  color: LogoColorKey;
  heightVar: string;
  multiplier?: number;
  alt: string;
}) {
  const url = asset(spec.src);

  if (color === "original") {
    return (
      <img
        src={url}
        alt={alt}
        width={spec.width}
        height={spec.height}
        loading="lazy"
        className="w-auto object-contain block"
        style={{
          height:
            multiplier === 1
              ? heightVar
              : `calc(${heightVar} * ${multiplier})`,
        }}
      />
    );
  }

  const hex = getBrandHex(color);
  return (
    <span
      role="img"
      aria-label={alt}
      className="inline-block shrink-0"
      style={{
        height:
          multiplier === 1
            ? heightVar
            : `calc(${heightVar} * ${multiplier})`,
        aspectRatio: spec.ratio,
        backgroundColor: hex,
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

export function BrandLogo({
  variant = "wordmark",
  color = "original",
  heightMobile = 32,
  heightDesktop = 40,
  className,
  asPreview = false,
  focusClassName,
}: BrandLogoProps) {
  const styleVars = {
    "--logo-h-m": `${heightMobile}px`,
    "--logo-h-d": `${heightDesktop}px`,
  } as React.CSSProperties;

  const heightCss = "var(--logo-h)";

  const inner =
    variant === "mascot-left" ? (
      <span className="inline-flex items-center gap-2">
        <SvgGraphic
          spec={SVG_SPECS.mascot}
          color={color}
          heightVar={heightCss}
          multiplier={1.4}
          alt=""
        />
        <SvgGraphic
          spec={SVG_SPECS.wordmark}
          color={color}
          heightVar={heightCss}
          alt="Cocomishri"
        />
      </span>
    ) : variant === "full" ? (
      <SvgGraphic
        spec={SVG_SPECS.full}
        color={color}
        heightVar={heightCss}
        alt="Cocomishri"
      />
    ) : variant === "mascot" ? (
      <SvgGraphic
        spec={SVG_SPECS.mascot}
        color={color}
        heightVar={heightCss}
        alt="Cocomishri"
      />
    ) : (
      <SvgGraphic
        spec={SVG_SPECS.wordmark}
        color={color}
        heightVar={heightCss}
        alt="Cocomishri"
      />
    );

  const wrapperClass = cn(
    "inline-flex items-center min-h-[44px] [--logo-h:var(--logo-h-m)] lg:[--logo-h:var(--logo-h-d)]",
    focusClassName,
    className
  );

  if (asPreview) {
    return (
      <div style={styleVars} className={wrapperClass}>
        {inner}
      </div>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Cocomishri home"
      style={styleVars}
      className={wrapperClass}
    >
      {inner}
    </Link>
  );
}
