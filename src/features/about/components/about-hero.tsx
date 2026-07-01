import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { ABOUT } from "@/features/about/data/about";

/** First letters of the first two words — used when a logo image is missing. */
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * About hero — a single portrait paired with the intro copy.
 * Presentational only; all content comes from the `ABOUT` data module.
 */
export function AboutHero() {
  const { eyebrow, photo, paragraphs, education } = ABOUT;

  return (
    <section className="px-4">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.5fr_1.5fr] lg:gap-16">
        {/* Photo — offset brand block behind gives it a brutalist frame. */}
        <Reveal className="relative mx-auto w-full max-w-[240px] lg:mx-0">
          <div className="absolute -inset-3 -z-10 rotate-[-3deg] rounded-2xl bg-brand-lime" />
          <div className="overflow-hidden rounded-2xl border border-border bg-brand-charcoal">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={1000}
              priority
              unoptimized
              className="aspect-[4/5] h-auto w-full object-cover"
            />
          </div>
        </Reveal>

        {/* Intro copy */}
        <div>
          <Reveal>
            <p className="font-script text-2xl text-brand-purple sm:text-6xl">
              {eyebrow}
            </p>
          </Reveal>

          {paragraphs.map((text, i) => (
            <Reveal key={i} delay={200 + i * 80}>
              <p className="mt-5 text-base text-muted-foreground text-pretty sm:text-lg">
                {text}
              </p>
            </Reveal>
          ))}

          {/* Education — a single institution shown as a compact card. */}
          <Reveal delay={200 + paragraphs.length * 80}>
            <p className="mt-8 font-script text-xl text-brand-purple sm:text-2xl">
              {education.label}
            </p>
            <div className="mt-3 flex items-center gap-4 rounded-2xl">
              <Image
                src={education.logo.src}
                alt={education.logo.alt}
                width={50}
                height={50}
                className="rounded-lg object-contain"
              />

              <div className="min-w-0">
                <p className="font-heading text-base font-bold tracking-tight sm:text-2xl">
                  {education.institution}
                </p>
                <p className="text-sm text-muted-foreground">
                  {education.degree}
                </p>
                <p className="text-sm text-muted-foreground">
                  {education.years}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
