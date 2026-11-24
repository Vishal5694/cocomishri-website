import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Order Tracking",
};

export default function TrackOrderPage() {
  return <ComingSoon title="Order Tracking" eyebrow="Support" />;
}
