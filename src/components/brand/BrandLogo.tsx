import * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { getBrandHex, type LogoColorKey } from "@/lib/brand-colors";
import type { LogoVariant } from "@/lib/header-config";
import { cn } from "@/lib/utils";

const OriginalLightSvg = dynamic(() =>
  import("./OriginalLightSvgs").then((m) => m.OriginalLightSvg)
);

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
  variantKey,
  spec,
  color,
  heightVar,
  multiplier = 1,
  alt,
}: {
  variantKey: keyof typeof SVG_SPECS;
  spec: (typeof SVG_SPECS)[keyof typeof SVG_SPECS];
  color: LogoColorKey;
  heightVar: string;
  multiplier?: number;
  alt: string;
}) {
  const url = asset(spec.src);
  const resolvedHeight =
    multiplier === 1 ? heightVar : `calc(${heightVar} * ${multiplier})`;

  if (color === "original-light") {
    return (
      <OriginalLightSvg
        variant={variantKey}
        height={resolvedHeight}
        aspectRatio={spec.ratio}
        alt={alt}
      />
    );
  }

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
          height: resolvedHeight,
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
        height: resolvedHeight,
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
          variantKey="mascot"
          spec={SVG_SPECS.mascot}
          color={color}
          heightVar={heightCss}
          multiplier={1.4}
          alt=""
        />
        <SvgGraphic
          variantKey="wordmark"
          spec={SVG_SPECS.wordmark}
          color={color}
          heightVar={heightCss}
          alt="Cocomishri"
        />
      </span>
    ) : variant === "full" ? (
      <SvgGraphic
        variantKey="full"
        spec={SVG_SPECS.full}
        color={color}
        heightVar={heightCss}
        alt="Cocomishri"
      />
    ) : variant === "mascot" ? (
      <SvgGraphic
        variantKey="mascot"
        spec={SVG_SPECS.mascot}
        color={color}
        heightVar={heightCss}
        alt="Cocomishri"
      />
    ) : (
      <SvgGraphic
        variantKey="wordmark"
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
