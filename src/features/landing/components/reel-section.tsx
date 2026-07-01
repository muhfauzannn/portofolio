"use client";

import { Play } from "lucide-react";
import { toast } from "sonner";

import { Reveal } from "@/components/motion/reveal";

export function ReelSection() {
  return (
    <section className="relative px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-balance sm:text-5xl">
            Everything you need to build sites that{" "}
            <span className="text-brand-purple">feel alive.</span>
          </h2>
        </Reveal>

        <div className="relative mt-14">
          {/* Oversized faded background label */}
          <span
            aria-hidden
            className="text-outline pointer-events-none absolute -top-10 left-1/2 -z-10 -translate-x-1/2 font-heading text-[22vw] leading-none font-bold opacity-[0.06] select-none"
          >
            REEL
          </span>

          <Reveal className="relative mx-auto max-w-3xl">
            {/* Video thumbnail — crisp 8px radius (§2C) */}
            <div className="group relative grid aspect-video place-items-center overflow-hidden rounded-lg bg-brand-charcoal ring-1 ring-foreground/10">
              <div className="bg-grid absolute inset-0 opacity-30" />
              <button
                onClick={() => toast("Playing the reel…", { icon: "🎬" })}
                className="relative grid size-20 place-items-center rounded-full bg-brand-lime text-brand-lime-foreground transition-transform duration-300 group-hover:scale-110"
                aria-label="Play reel"
              >
                <Play className="size-8 translate-x-0.5 fill-current" />
              </button>
            </div>

            {/* Brisa-Pro-style handwritten annotation (§3) */}
            <div className="pointer-events-none absolute -right-2 -bottom-10 flex items-center gap-1 sm:-right-16">
              <span className="font-script text-3xl text-brand-purple">
                See what it can do!
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
