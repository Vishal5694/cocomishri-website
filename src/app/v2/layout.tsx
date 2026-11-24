import type { Metadata } from "next";
import { HeaderV2 } from "@/components/v2/HeaderV2";
import { FooterV2 } from "@/components/v2/FooterV2";

export const metadata: Metadata = {
  title: "Cocomishri — Sweet like Mishri. Soft like a hug.",
  description: "Where little dreams wear love.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function V2Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-cocoa-900">
      <HeaderV2 />
      <main id="main" className="flex-1">
        {children}
      </main>
      <FooterV2 />
    </div>
  );
}
