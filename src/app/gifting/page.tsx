import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Gifting",
};

export default function GiftingPage() {
  return <ComingSoon title="Gifting" eyebrow="Special Moments" />;
}
