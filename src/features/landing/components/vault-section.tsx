import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Reveal } from "@/components/motion/reveal";
import { Eyebrow } from "@/features/landing/components/eyebrow";
import { VAULT } from "@/features/landing/data/landing";

export function VaultSection() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>Drag to explore</Eyebrow>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              The Vault
            </h2>
          </div>
          <span className="font-script text-2xl text-brand-purple">
            ← drag me →
          </span>
        </Reveal>

        <Carousel opts={{ align: "start", dragFree: true }}>
          <CarouselContent>
            {VAULT.map((v) => (
              <CarouselItem
                key={v.name}
                className="basis-4/5 sm:basis-1/2 lg:basis-1/3"
              >
                {/* Medium structural card (16px) w/ crisp inner geometry */}
                <div className="group h-full rounded-2xl border border-border bg-card p-2 ring-1 ring-foreground/5">
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-lg bg-muted">
                    <div className="bg-grid absolute inset-0 opacity-40" />
                    <v.icon className="size-12 text-brand-purple transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-heading font-medium">{v.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {v.meta}
                      </div>
                    </div>
                    <Button
                      size="icon-sm"
                      variant="outline"
                      className="rounded-full"
                    >
                      <ArrowUpRight />
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
