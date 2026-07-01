import { SiteNav } from "@/components/layout/site-nav";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { AboutHero } from "@/features/about/components/about-hero";

/**
 * About feature — composes the page from self-contained sections.
 */
export function AboutPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <MagneticCursor />
      <SiteNav />

      <main className="flex-1">
        <AboutHero />
      </main>
    </div>
  );
}
