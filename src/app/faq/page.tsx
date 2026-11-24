import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FaqPage() {
  return <ComingSoon title="FAQ" eyebrow="Help & Support" />;
}
