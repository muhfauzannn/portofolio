import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { ABOUT } from "@/features/about/data/about";

/**
 * About hero — a single portrait paired with the intro copy.
 * Presentational only; all content comes from the `ABOUT` data module.
 */
export function AboutHero() {
  const { eyebrow, name, role, location, photo, paragraphs } = ABOUT;

  return (
    <section className="px-4 pt-16 pb-20 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        {/* Photo — Polaroid-style frame: white border with a larger bottom lip. */}
        <Reveal className="mx-auto w-full max-w-60 lg:mx-0">
          <div className="rounded-lg bg-white p-3 pb-8 shadow-xl shadow-foreground/10">
            <div className="overflow-hidden bg-brand-charcoal">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={1000}
                priority
                unoptimized
                className="aspect-4/5 h-auto w-full object-cover"
              />
            </div>
          </div>
        </Reveal>

        {/* Intro copy */}
        <div>
          <Reveal>
            <p className="font-script text-2xl text-brand-purple sm:text-3xl">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-2 font-heading text-5xl font-bold tracking-tighter text-balance sm:text-6xl">
              {name}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="purple">{role}</Badge>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {location}
              </span>
            </div>
          </Reveal>

          {paragraphs.map((text, i) => (
            <Reveal key={i} delay={200 + i * 80}>
              <p className="mt-5 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
                {text}
              </p>
            </Reveal>
          ))}

          <Reveal delay={200 + paragraphs.length * 80}>
            <Button size="pill" className="mt-8" asChild>
              <TransitionLink href="/contact">
                Get in touch
                <ArrowUpRight className="size-4" />
              </TransitionLink>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
