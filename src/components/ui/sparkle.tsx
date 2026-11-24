import * as React from "react";
import { cn } from "@/lib/utils";

export type SparkleSize = 12 | 16 | 20;

export interface SparkleProps extends React.SVGAttributes<SVGSVGElement> {
  size?: SparkleSize;
}

export function Sparkle({
  size = 16,
  className,
  ...props
}: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("text-amber-500 shrink-0", className)}
      {...props}
    >
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

export interface SparkleDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  sparkleSize?: SparkleSize;
}

export function SparkleDivider({
  className,
  sparkleSize = 16,
  ...props
}: SparkleDividerProps) {
  return (
    <div
      role="separator"
      className={cn(
        "flex items-center justify-center gap-3 w-full py-4",
        className
      )}
      {...props}
    >
      <div className="h-px flex-1 bg-sand-300" />
      <Sparkle size={sparkleSize} />
      <div className="h-px flex-1 bg-sand-300" />
    </div>
  );
}
