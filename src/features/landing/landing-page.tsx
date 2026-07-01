import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { HeroSection } from "@/features/landing/components/hero-section";
import { ReelSection } from "@/features/landing/components/reel-section";
import { SpotlightSection } from "@/features/landing/components/spotlight-section";
import { VaultSection } from "@/features/landing/components/vault-section";
import { CommunitySection } from "@/features/landing/components/community-section";
import { MarqueeBand } from "@/features/landing/components/marquee-band";
import { DesignSystemSection } from "@/features/landing/components/design-system-section";

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
        <ReelSection />
        <SpotlightSection />
        <VaultSection />
        <CommunitySection />
        <MarqueeBand />
        <DesignSystemSection />
      </main>

      <SiteFooter />
    </div>
  );
}
