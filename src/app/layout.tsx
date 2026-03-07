import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModeSwitcher } from "@/components/mode-switcher/ModeSwitcher";
import { LanguageSwitcher } from "@/components/mode-switcher/LanguageSwitcher";
import { DeveloperOverlay } from "@/features/developer-mode/DeveloperOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gian | Information Systems Engineer",
  description: "Portfolio showcasing high-performance web applications and systems architecture like GRADEO.",
  openGraph: {
    title: "Gian | Information Systems Engineer",
    description: "Portfolio showcasing high-performance web applications and systems architecture like GRADEO.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 selection:bg-white/20`}
      >
        <LanguageSwitcher />
        <ModeSwitcher />
        <DeveloperOverlay />
        {children}
      </body>
    </html>
  );
}
