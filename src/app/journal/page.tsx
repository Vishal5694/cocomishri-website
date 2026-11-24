import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Journal",
};

export default function JournalPage() {
  return <ComingSoon title="Journal" eyebrow="About" />;
}
