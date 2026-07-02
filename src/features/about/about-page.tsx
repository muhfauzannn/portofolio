import { SiteNav } from "@/components/layout/site-nav";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { AboutHero } from "@/features/about/components/about-hero";
import { getAbout } from "@/features/about/lib/queries";

/**
 * About feature — composes the page from self-contained sections. Server
 * Component: reads the (cached) About content and passes it down.
 */
export async function AboutPage() {
  const content = await getAbout();

  return (
    <div id="about" className="relative flex min-h-full scroll-mt-28 flex-col">
      <MagneticCursor />
      <SiteNav />

      <main className="flex-1">
        {content ? <AboutHero content={content} /> : null}
      </main>
    </div>
  );
}
