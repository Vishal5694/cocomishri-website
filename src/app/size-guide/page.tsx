import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Size Guide",
};

export default function SizeGuidePage() {
  return <ComingSoon title="Size Guide" eyebrow="Help & Support" />;
}
