import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "stock" | "new" | "label";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  stock: "bg-sage-100 text-sage-700",
  new: "bg-blush-100 text-blush-700",
  label: "bg-caramel-100 text-caramel-700",
};

export function Badge({
  className,
  variant = "stock",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-pill px-[10px] py-[4px] text-[12px] font-medium leading-none tracking-wide select-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
