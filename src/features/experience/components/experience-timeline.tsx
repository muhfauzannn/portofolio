import { Reveal } from "@/components/motion/reveal";
import { ExperienceAccordion } from "@/features/experience/components/experience-accordion";
import { EXPERIENCE } from "@/features/experience/data/experience";

/**
 * Experience — a stack of long cards. Each shows only the institution name
 * until clicked, then unfurls the role, period and description. The section
 * header is a Server Component; the interactive accordion is a client leaf.
 */
export function ExperienceTimeline() {
  const { eyebrow, heading, items } = EXPERIENCE;

  return (
    <section
      id="experience"
      className="scroll-mt-28 bg-brand-charcoal px-4 pt-20 text-brand-cream sm:pt-28"
    >
      <div className="w-full">
        {/* Section header — matches the Skills section rhythm. */}
        <div className="text-center">
          <Reveal>
            <p className="font-script text-2xl text-brand-lime sm:text-3xl">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-1 font-heading text-4xl font-bold tracking-tighter text-balance sm:text-6xl">
              {heading}
            </h2>
          </Reveal>
        </div>

        <ExperienceAccordion items={items} />
      </div>
    </section>
  );
}
