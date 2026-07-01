import { Globe, Quote } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/motion/reveal";
import { LOCATIONS } from "@/features/landing/data/landing";

export function CommunitySection() {
  return (
    <section className="px-4 pb-24">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left — dark vertical capsule, green locations (§2A) */}
        <Reveal>
          <div className="flex h-full flex-col items-center gap-6 rounded-[3rem] bg-brand-charcoal px-8 py-12 text-center text-brand-cream">
            <Globe className="size-10 text-brand-lime" />
            <div>
              <div className="font-heading text-4xl font-bold">120k+</div>
              <div className="text-sm text-white/60">creators worldwide</div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {LOCATIONS.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
                >
                  <span className="size-1.5 rounded-full bg-brand-lime" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — purple testimonial, medium radius (§2B) */}
        <Reveal delay={80}>
          <div className="flex h-full flex-col justify-between rounded-2xl bg-brand-purple p-8 text-brand-purple-foreground sm:p-12">
            <Quote className="size-10 text-brand-lime" />
            <p className="mt-6 font-heading text-2xl leading-snug font-medium text-balance sm:text-3xl">
              “Osmo empowered me to ship interactions I used to outsource. My
              build time dropped by half and the quality went up.”
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Avatar className="size-12 ring-2 ring-brand-lime">
                <AvatarFallback className="bg-brand-charcoal text-brand-cream">
                  MK
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-script text-2xl leading-none">Maya Koda</div>
                <div className="text-sm text-white/70">
                  Design Engineer, Studio Nine
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
