import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { SiteHeader } from "@/components/layout/site-header";
import { HeroParticles } from "@/components/ui/hero-particles";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hastra Prototype",
  description: "Headless-ready prototype for the new Hastra website.",
  icons: { icon: "/logo-3.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={GeistSans.variable}>
      <body className="min-h-screen bg-[var(--color-primary)] font-sans text-white antialiased">
        <div className="fixed inset-0 z-0">
          <HeroParticles className="absolute inset-0" />
        </div>
        <div className="relative z-10">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
