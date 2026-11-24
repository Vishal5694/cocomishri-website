import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Shipping Policy",
};

export default function ShippingPage() {
  return <ComingSoon title="Shipping" eyebrow="Help & Support" />;
}
