"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export interface SectionProps {
  children: React.ReactNode;
  bg?: "cream-50" | "sand-100" | "blush-100" | "transparent";
  noContainer?: boolean;
  className?: string;
  containerClassName?: string;
  id?: string;
}

const bgClasses: Record<string, string> = {
  "cream-50": "bg-cream-50",
  "sand-100": "bg-sand-100",
  "blush-100": "bg-blush-100",
  transparent: "bg-transparent",
};

export function Section({
  children,
  bg = "cream-50",
  noContainer = false,
  className,
  containerClassName,
  id,
}: SectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? {
        initial: false,
      }
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      };

  return (
    <motion.section
      id={id}
      {...animationProps}
      className={cn(
        bgClasses[bg] || "bg-cream-50",
        noContainer ? "" : "py-16 lg:py-24",
        className
      )}
    >
      {noContainer ? (
        children
      ) : (
        <Container className={containerClassName}>
          {children}
        </Container>
      )}
    </motion.section>
  );
}
