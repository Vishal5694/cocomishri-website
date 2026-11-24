import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Shop",
};

export default function ShopPage() {
  return <ComingSoon title="Shop" eyebrow="Collection" />;
}
