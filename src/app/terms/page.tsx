import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return <ComingSoon title="Terms of Service" eyebrow="Legal" />;
}
