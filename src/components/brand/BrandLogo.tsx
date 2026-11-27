import * as React from "react";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  heightMobile?: number;
  heightDesktop?: number;
  className?: string;
  focusClassName?: string;
  // Kept optional for backwards-compatible call sites
  variant?: string;
  color?: string;
}

export function BrandLogo({
  heightMobile = 32,
  heightDesktop = 40,
  className,
  focusClassName,
}: BrandLogoProps) {
  const styleVars = {
    "--logo-h-m": `${heightMobile}px`,
    "--logo-h-d": `${heightDesktop}px`,
  } as React.CSSProperties;

  return (
    <Link
      href="/"
      aria-label="Cocomishri home"
      style={styleVars}
      className={cn(
        "inline-flex items-center min-h-[44px] [--logo-h:var(--logo-h-m)] lg:[--logo-h:var(--logo-h-d)]",
        focusClassName,
        className
      )}
    >
      <img
        src={asset("/brand/wordmark.svg")}
        alt="Cocomishri"
        width={573}
        height={137}
        loading="lazy"
        className="w-auto object-contain block h-[var(--logo-h)]"
      />
    </Link>
  );
}
