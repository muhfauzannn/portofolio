import { SiteNav } from "@/components/layout/site-nav";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { HeroSection } from "@/features/landing/components/hero-section";
import { IntroOverlay } from "@/features/landing/components/intro-overlay";
import { AboutPage } from "../about";
import { ExperiencePage } from "../experience";
import { ProjectsPage } from "../projects";
import { SkillsPage } from "../skills";

/**
 * Landing feature — composes the page from self-contained sections.
 * Order follows the layout defined in DESIGN.md §5.
 */
export function LandingPage() {
  return (
    <div id="top" className="relative flex min-h-full flex-col">
      <IntroOverlay />
      <MagneticCursor />
      <SiteNav />

      <main className="flex flex-col gap-30 max-md:gap-20">
        <HeroSection />
        <AboutPage />
        <ExperiencePage />
        <ProjectsPage />
        <SkillsPage />
      </main>
    </div>
  );
}
