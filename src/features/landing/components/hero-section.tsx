"use client";

import { ArrowRight, Asterisk, Play, Star } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ASSETS } from "@/features/landing/data/landing";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-24 sm:pt-24">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="mb-6 flex justify-center">
            <Badge variant="purple" className="gap-1.5">
              <Star className="size-3" /> New resource — weekly drops
            </Badge>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <h1 className="font-heading text-5xl leading-[0.95] font-bold tracking-tighter text-balance sm:text-7xl">
            The creative
            <span className="relative mx-3 inline-flex items-center">
              <Asterisk className="size-10 animate-spin text-brand-purple [animation-duration:6s] sm:size-14" />
            </span>
            developer
            <br />
            <span className="text-brand-purple">toolkit</span> that ships.
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
            Production-ready components, motion systems and 3D assets. Built on a
            strict{" "}
            <span className="inline-flex flex-wrap gap-1.5 align-middle">
              <Badge variant="outline">Webflow</Badge>
              <Badge variant="outline">HTML</Badge>
              <Badge variant="outline">Icons</Badge>
            </span>{" "}
            foundation.
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="pill-lg"
              onClick={() => toast.success("Welcome to the toolkit!")}
            >
              Start building <ArrowRight data-icon="inline-end" />
            </Button>
            <Button size="pill-lg" variant="charcoal">
              <Play data-icon="inline-start" /> Watch the reel
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Scattered crisp asset cards radiating from bottom center (§2C) */}
      <div className="mx-auto mt-16 flex max-w-5xl flex-wrap items-end justify-center gap-4">
        {ASSETS.map((a, i) => (
          <Reveal key={a.name} delay={220 + i * 90}>
            <div
              style={{ rotate: a.tilt }}
              className="group w-40 rounded-lg border border-border bg-card p-4 shadow-xl shadow-foreground/5 ring-1 ring-foreground/5 transition-transform duration-300 hover:-translate-y-2 hover:rotate-0 sm:w-48"
            >
              <div className="mb-3 grid aspect-video place-items-center rounded-md bg-muted">
                <a.icon className="size-8 text-brand-purple transition-transform group-hover:scale-110" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{a.name}</span>
                <Badge variant="secondary" className="scale-90">
                  {a.tag}
                </Badge>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
