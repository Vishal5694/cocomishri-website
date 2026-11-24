import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export function Card({
  className,
  bordered = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-sand-100 rounded-card p-4 lg:p-6",
        bordered && "border border-sand-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
