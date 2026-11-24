import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TextLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "cream";
  external?: boolean;
  className?: string;
}

export function TextLink({
  href,
  children,
  variant = "dark",
  external = false,
  className,
}: TextLinkProps) {
  const classes = cn(
    "font-body font-semibold text-[13px] uppercase tracking-[0.12em] underline underline-offset-4 min-h-[44px] inline-flex items-center justify-center px-2 transition-colors duration-300 ease-soft",
    variant === "cream"
      ? "text-cream-50 hover:text-caramel-100 focus-visible:outline-2 focus-visible:outline-cream-50 focus-visible:outline-offset-2"
      : "text-cocoa-900 hover:text-blush-700 focus-visible:outline-2 focus-visible:outline-blush-700 focus-visible:outline-offset-2",
    className
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
