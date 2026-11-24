import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { asset } from "@/lib/asset";
import { PanelProvider } from "@/lib/ui/PanelContext";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  icons: {
    icon: asset("/favicon.ico"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunitoSans.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-cream-50 text-cocoa-900">
        <PanelProvider>
          <SiteChrome>{children}</SiteChrome>
        </PanelProvider>
      </body>
    </html>
  );
}
