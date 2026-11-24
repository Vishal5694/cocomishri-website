import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
};

export default function ReturnsPage() {
  return <ComingSoon title="Returns & Exchanges" eyebrow="Help & Support" />;
}
