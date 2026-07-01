import { SiteNav } from "@/components/layout/site-nav";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { HeroSection } from "@/features/landing/components/hero-section";

/**
 * Landing feature — composes the page from self-contained sections.
 * Order follows the layout defined in DESIGN.md §5.
 */
export function LandingPage() {
  return (
    <div id="top" className="relative flex min-h-full flex-col">
      <MagneticCursor />
      <SiteNav />

      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}
