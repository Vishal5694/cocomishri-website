import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Shopping Bag",
};

export default function BagPage() {
  return <ComingSoon title="Shopping Bag" eyebrow="Your Order" />;
}
