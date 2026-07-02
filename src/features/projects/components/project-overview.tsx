import { Reveal } from "@/components/motion/reveal";

/**
 * Overview — a mono section label above one large, readable paragraph.
 */
export function ProjectOverview({ overview }: { overview: string }) {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-4 sm:mt-24">
      <Reveal>
        <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">
          Overview
        </p>
      </Reveal>
      <Reveal delay={80}>
        <p className="mt-4 text-xl leading-relaxed text-foreground/90 text-pretty sm:text-2xl">
          {overview}
        </p>
      </Reveal>
    </section>
  );
}
