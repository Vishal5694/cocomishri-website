import type { Metadata } from "next";
import { ComingSoon } from "@/components/layout/ComingSoon";

export const metadata: Metadata = {
  title: "Fabric & Care",
};

export default function FabricCarePage() {
  return <ComingSoon title="Fabric & Care" eyebrow="About" />;
}
