import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import {
  EXPERIENCE,
  type ExperienceItem,
} from "@/features/experience/data/experience";

/** First letters of the first two words — used when a logo image is missing. */
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Experience timeline — a vertical rail of roles, newest first.
 * Presentational only; all content comes from the `EXPERIENCE` data module.
 */
export function ExperienceTimeline() {
  const { eyebrow, heading, items } = EXPERIENCE;

  return (
    <section className="px-4">
      <div className="mx-auto max-w-4xl">
        {/* Section header — matches the Skills section rhythm. */}
        <div className="text-center">
          <Reveal>
            <p className="font-script text-2xl text-brand-purple sm:text-3xl">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-1 font-heading text-4xl font-bold tracking-tighter text-balance sm:text-6xl">
              {heading}
            </h2>
          </Reveal>
        </div>

        {/* Timeline rail */}
        <ol className="relative mt-12 space-y-6 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-border sm:before:left-[15px]">
          {items.map((item, i) => (
            <TimelineRow key={item.period + item.institution} item={item} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineRow({ item, index }: { item: ExperienceItem; index: number }) {
  return (
    <Reveal as="li" delay={120 + index * 100} className="relative pl-12 sm:pl-16">
      {/* Node on the rail */}
      <span className="absolute left-0 top-6 grid size-7 place-items-center rounded-full border border-border bg-background sm:size-8">
        <span className="size-2.5 rounded-full bg-brand-purple" />
      </span>

      <article className="rounded-lg border border-border bg-card p-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5 sm:p-6">
        <Badge variant="secondary" className="rounded-full font-medium">
          {item.period}
        </Badge>

        <div className="mt-4 flex items-start gap-4">
          {/* Logo — falls back to the institution's initials. */}
          <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-brand-cream">
            {item.logo.src ? (
              <Image
                src={item.logo.src}
                alt={item.logo.alt}
                width={48}
                height={48}
                className="size-full object-contain p-1.5"
              />
            ) : (
              <span className="font-heading text-sm font-bold text-brand-charcoal">
                {initials(item.institution)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
              {item.role}
            </h3>
            <p className="text-sm text-muted-foreground">{item.institution}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground text-pretty sm:text-base">
          {item.description}
        </p>
      </article>
    </Reveal>
  );
}
