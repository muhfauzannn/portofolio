import type { Metadata } from "next";
import { SkillsPage } from "@/features/skills";

export const metadata: Metadata = {
  title: "Skills — Muhammad Fauzan",
  description:
    "The tools and technologies Muhammad Fauzan works with, plus a live GitHub contribution graph.",
};

export default function SkillsRoute() {
  return <SkillsPage />;
}
