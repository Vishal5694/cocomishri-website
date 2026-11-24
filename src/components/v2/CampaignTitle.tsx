import * as React from "react";
import { cn } from "@/lib/utils";

export interface CampaignTitleProps {
  as?: "h1" | "h2" | "h3" | "p";
  children: React.ReactNode;
  className?: string;
}

export function CampaignTitle({
  as: Tag = "h2",
  children,
  className,
}: CampaignTitleProps) {
  return (
    <Tag
      className={cn(
        "font-heading font-medium normal-case tracking-normal text-[32px] lg:text-[48px] leading-[1.15] [font-variation-settings:'SOFT'_75]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
