import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/features/landing/components/eyebrow";
import { UPDATES } from "@/features/landing/data/landing";

export function SpotlightSection() {
  return (
    <section className="px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
        {/* Left — Creator card, medium radius, purple (§2B) */}
        <Reveal>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-brand-purple p-8 text-brand-purple-foreground">
            <div className="absolute -top-16 -right-16 size-56 rounded-full bg-white/10" />
            <div className="absolute top-8 right-8 size-28 rounded-full bg-brand-lime/90" />
            <Eyebrow>
              <span className="text-white/70">Creator spotlight</span>
            </Eyebrow>
            <div className="mt-16">
              <div className="font-script text-4xl">Dennis Snellenberg</div>
              <p className="mt-3 max-w-sm text-white/80">
                Award-winning developer shipping 40+ interaction systems with the
                toolkit this year alone.
              </p>
              <Button variant="charcoal" size="pill" className="mt-6">
                View profile <ArrowUpRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Right — Updates, massive charcoal capsule (§2A) */}
        <Reveal delay={80}>
          <div className="flex h-full flex-col gap-4 rounded-[2.5rem] bg-brand-charcoal p-8 text-brand-cream">
            <div className="flex items-center justify-between">
              <Eyebrow>
                <span className="text-white/60">Latest updates</span>
              </Eyebrow>
              <Badge variant="lime">Live</Badge>
            </div>
            <div className="flex flex-col gap-3">
              {UPDATES.map((u) => (
                <div
                  key={u.title}
                  className="flex items-center gap-4 rounded-lg bg-white/5 p-4 ring-1 ring-white/10 transition-colors hover:bg-white/10"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-md bg-brand-lime text-brand-lime-foreground">
                    <u.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{u.title}</div>
                    <div className="truncate text-xs text-white/60">
                      {u.detail}
                    </div>
                  </div>
                  <ArrowUpRight className="ml-auto size-4 text-white/40" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
