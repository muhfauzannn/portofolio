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
      <div className="mx-auto flex flex-col max-w-6xl items-center gap-10  lg:gap-16">
        {/* Photo — offset brand block behind gives it a brutalist frame. */}

        {/* Intro copy */}
        <div>
          <Reveal>
            <p className="font-script text-2xl text-brand-purple sm:text-6xl">
              {eyebrow}
            </p>
          </Reveal>

          {paragraphs.map((text, i) => (
            <Reveal key={i} delay={200 + i * 80}>
              <p className="mt-5 text-7xl sm:text-5xl">{text}</p>
            </Reveal>
          ))}

          {/* Education — a single institution shown as a compact card. */}
          <Reveal
            delay={200 + paragraphs.length * 80}
            className="w-full flex flex-col items-end"
          >
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
                <p className="font-heading text-base font-normal tracking-tight sm:text-2xl">
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
            <div></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
