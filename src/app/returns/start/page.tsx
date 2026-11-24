import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Start a Return",
};

export default function StartReturnPage() {
  return <ComingSoon title="Start a Return" eyebrow="Support" />;
}
