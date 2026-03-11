import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { DynamicDotsBackground } from "@/components/ui/dynamic-dots-background";

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
      <body className="min-h-screen bg-[var(--color-background)] font-sans text-[var(--color-foreground)] antialiased">
        <div className="page-shell">
          <DynamicDotsBackground />
          <div className="page-shell-content">
            <div className="page-aurora" />
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
