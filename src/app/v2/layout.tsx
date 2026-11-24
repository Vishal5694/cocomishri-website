import type { Metadata } from "next";

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
  return <>{children}</>;
}
