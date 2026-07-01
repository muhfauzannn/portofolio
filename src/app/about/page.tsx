import type { Metadata } from "next";
import { AboutPage } from "@/features/about";

export const metadata: Metadata = {
  title: "About — Muhammad Fauzan",
  description: "About Muhammad Fauzan — creative developer, skills, and tools.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
