import Image from "next/image";

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
 * Experience — an asymmetric bento: a wide dark feature banner for the current
 * role over two equal neutral tiles. Premium/minimal: generous padding, big
 * type, a single lime accent on the period. Presentational only; content comes
 * from the `EXPERIENCE` data module.
 */
export function ExperienceTimeline() {
  const { eyebrow, heading, items } = EXPERIENCE;
  const [feature, ...rest] = items;

  return (
    <section className="px-4">
      <div className="mx-auto max-w-5xl">
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

        {/* Bento — wide feature banner over two equal tiles. */}
        <ol className="mt-12 grid gap-4 sm:grid-cols-2">
          <FeatureTile item={feature} />
          {rest.map((item, i) => (
            <QuietTile
              key={item.period + item.institution}
              item={item}
              index={i}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Small institution logo / initials chip, reused across tiles. */
function LogoChip({
  item,
  className,
}: {
  item: ExperienceItem;
  className?: string;
}) {
  return (
    <div
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-brand-cream ${className}`}
    >
      {item.logo.src ? (
        <Image
          src={item.logo.src}
          alt={item.logo.alt}
          width={64}
          height={64}
          className="size-full object-contain p-2"
        />
      ) : (
        <span className="font-heading text-lg font-bold text-brand-charcoal">
          {initials(item.institution)}
        </span>
      )}
    </div>
  );
}

/** Period, rendered as a quiet uppercase label with a single lime dot. */
function PeriodLabel({
  period,
  className,
}: {
  period: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase ${className}`}
    >
      <span className="size-1.5 rounded-full bg-brand-lime" />
      {period}
    </span>
  );
}

function FeatureTile({ item }: { item: ExperienceItem }) {
  return (
    <Reveal as="li" delay={120} className="sm:col-span-2">
      <article className="rounded-2xl bg-brand-charcoal p-8 text-brand-cream transition-transform duration-300 ease-out hover:-translate-y-1 sm:p-10">
        <div className="flex items-start justify-between gap-6">
          <PeriodLabel period={item.period} className="text-brand-cream/70" />
          <LogoChip item={item} className="size-14" />
        </div>

        <h3 className="mt-8 font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {item.role}
        </h3>
        <p className="mt-2 text-base font-medium text-brand-cream/60">
          {item.institution}
        </p>
        <p className="mt-5 max-w-2xl text-sm text-brand-cream/70 text-pretty sm:text-base">
          {item.description}
        </p>
      </article>
    </Reveal>
  );
}

function QuietTile({
  item,
  index,
}: {
  item: ExperienceItem;
  index: number;
}) {
  return (
    <Reveal as="li" delay={220 + index * 100} className="h-full">
      <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-foreground/20 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <PeriodLabel period={item.period} className="text-muted-foreground" />
          <LogoChip item={item} className="size-11" />
        </div>

        <h3 className="mt-6 font-heading text-xl font-bold tracking-tight sm:text-2xl">
          {item.role}
        </h3>
        <p className="text-sm font-medium text-muted-foreground">
          {item.institution}
        </p>
        <p className="mt-3 text-sm text-muted-foreground text-pretty">
          {item.description}
        </p>
      </article>
    </Reveal>
  );
}
