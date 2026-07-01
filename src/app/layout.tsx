import type { Metadata } from "next";
import { Space_Grotesk, Inter, Caveat, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransitionProvider } from "@/components/motion/page-transition";
import "./globals.css";

// Display / headings — stand-in for "Haffer XH"
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Body / UI — clean, highly legible sans
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
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
