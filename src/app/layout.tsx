import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { PanelProvider } from "@/lib/ui/PanelContext";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
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
          <div className="sticky top-0 z-40 w-full">
            <Header />
            <AnnouncementBar />
          </div>
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </PanelProvider>
      </body>
    </html>
  );
}
