"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { type ExperienceItem } from "@/features/experience/data/experience";

/** First letters of the first two words — used when a logo image is missing. */
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/** Small institution logo / initials chip. */
function LogoChip({
  item,
  className,
}: {
  item: ExperienceItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-xl",
        className,
      )}
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
        <span className="font-heading text-base font-bold text-brand-charcoal">
          {initials(item.institution)}
        </span>
      )}
    </div>
  );
}

/**
 * Experience — a full-width list. Each row shows the big institution name with
 * its logo on the far side; clicking a row unfurls that institution's roles as
 * a LinkedIn-style dotted sub-timeline (height animated via the grid-rows
 * trick). Client leaf; content is supplied by the server component via `items`.
 */
export function ExperienceAccordion({ items }: { items: ExperienceItem[] }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <Reveal delay={120} className="mt-12 sm:mt-14">
      <ol>
        {items.map((item, i) => {
          const open = openIndex === i;
          const panelId = `experience-panel-${i}`;

          return (
            <li
              key={item.institution}
              className="border-t border-white/10 first:border-t-0"
            >
              {/* Trigger — big institution name + role on the far side. */}
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="group flex w-full items-center justify-between gap-6 px-6 py-7 text-start sm:px-10 sm:py-9"
              >
                <span
                  className={cn(
                    "font-heading text-3xl font-normal tracking-tight transition-colors duration-300 sm:text-5xl",
                    open
                      ? "text-brand-cream"
                      : "text-brand-cream/30 group-hover:text-brand-cream",
                  )}
                >
                  {item.institution}
                </span>
                <LogoChip item={item} className="size-12  sm:size-14" />
              </button>

              {/* Detail — height unfurls via the grid-rows trick. */}
              <div
                id={panelId}
                className={cn(
                  "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div
                    className={cn(
                      "px-6 pb-8 transition-opacity duration-500 sm:px-10 sm:pb-10",
                      open ? "opacity-100 delay-100" : "opacity-0",
                    )}
                  >
                    {/* Roles — a LinkedIn-style dotted sub-timeline. */}
                    <ol>
                      {item.roles.map((r, idx) => {
                        const last = idx === item.roles.length - 1;
                        return (
                          <li key={r.period + r.role} className="flex gap-4">
                            {/* Rail: a dot per role, joined by a line. */}
                            <div className="flex flex-none flex-col items-center pt-1.5">
                              <span className="size-2.5 rounded-full bg-brand-lime ring-4 ring-brand-charcoal" />
                              {!last && (
                                <span className="mt-1 w-px grow bg-white/15" />
                              )}
                            </div>
                            <div
                              className={cn("min-w-0", last ? "pb-0" : "pb-6")}
                            >
                              <h3 className="font-heading text-lg font-normal tracking-tight text-balance sm:text-xl">
                                {r.role}
                              </h3>
                              <span className="mt-0.5 block text-xs font-medium tracking-widest text-brand-cream/50 uppercase">
                                {r.period}
                              </span>
                              <p className="mt-2 max-w-2xl text-sm text-brand-cream/70 text-pretty sm:text-base">
                                {r.description}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}
