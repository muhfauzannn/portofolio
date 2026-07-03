import type { Metadata } from "next";
import { Caveat, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransitionProvider } from "@/components/motion/page-transition";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

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

// Resolves relative metadata URLs (like the OG image) to absolute ones. Set
// NEXT_PUBLIC_SITE_URL to your production domain; falls back to localhost.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // `default` is used by the home page; `template` suffixes every child page
  // that sets its own title (e.g. "Projects — Fauzan's Portofolio").
  title: {
    default: "Fauzan's Portofolio",
    template: "%s — Fauzan's Portofolio",
  },
  description:
    "The portfolio of Muhammad Fauzan — Software Engineer, Web Developer, and DevOps Engineer.",
  openGraph: {
    title: "Fauzan's Portofolio",
    description:
      "The portfolio of Muhammad Fauzan — Software Engineer, Web Developer, and DevOps Engineer.",
    siteName: "Fauzan's Portofolio",
    type: "website",
    images: [
      {
        url: "/meta.png",
        width: 1268,
        height: 761,
        alt: "Fauzan's Portofolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fauzan's Portofolio",
    description:
      "The portfolio of Muhammad Fauzan — Software Engineer, Web Developer, and DevOps Engineer.",
    images: ["/meta.png"],
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
      className={`${hafferXH.variable} ${haffer.variable} ${caveat.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <TooltipProvider delayDuration={150}>
          <TransitionProvider>{children}</TransitionProvider>
        </TooltipProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
