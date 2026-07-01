import type { Metadata } from "next";
import { Caveat, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransitionProvider } from "@/components/motion/page-transition";
import "./globals.css";

// Display / headings — Haffer XH
const hafferXH = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

// Body / UI — Haffer XH
const haffer = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/font/haffer/HafferXH-TRIAL-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

// Handwritten accent — stand-in for "Brisa Pro"
const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Developer Toolkit — Design System",
  description:
    "A bold, brutalist-polished design system for creative developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hafferXH.variable} ${haffer.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TooltipProvider delayDuration={150}>
          <TransitionProvider>{children}</TransitionProvider>
        </TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
