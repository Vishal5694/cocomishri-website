import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-cocoa-900 text-cream-50 hover:bg-cocoa-700 active:bg-cocoa-700",
  secondary:
    "bg-transparent border-[1.5px] border-blush-700 text-blush-700 hover:bg-blush-100 active:bg-blush-100",
  ghost:
    "bg-transparent text-cocoa-900 hover:bg-sand-100 active:bg-sand-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "text-[13px] px-3.5 py-2 min-h-[44px]",
  md: "text-[15px] px-5 py-2.5 min-h-[44px]",
  lg: "text-[16px] px-7 py-3 min-h-[48px]",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      href,
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      "relative inline-flex items-center justify-center font-body font-medium rounded-pill tracking-normal select-none transition-colors duration-300 ease-soft cursor-pointer",
      variantStyles[variant],
      sizeStyles[size],
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
      className
    );

    const spinner = loading ? (
      <span
        aria-hidden="true"
        className={cn(
          "inline-block size-4 shrink-0 rounded-full border-2 animate-spin mr-2",
          variant === "primary"
            ? "border-cream-50 border-t-transparent"
            : variant === "secondary"
              ? "border-blush-700 border-t-transparent"
              : "border-cocoa-900 border-t-transparent"
        )}
      />
    ) : null;

    if (href) {
      return (
        <Link
          href={href}
          className={baseClasses}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : undefined}
        >
          {spinner}
          {children}
        </Link>
      );
    }

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
        children?: React.ReactNode;
      }>;
      return React.cloneElement(child, {
        className: cn(baseClasses, child.props.className),
        children: (
          <>
            {spinner}
            {child.props.children}
          </>
        ),
      });
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading ? "true" : undefined}
        className={baseClasses}
        {...props}
      >
        {spinner}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
