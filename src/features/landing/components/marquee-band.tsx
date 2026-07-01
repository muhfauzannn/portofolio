import { Asterisk } from "lucide-react";

import { Marquee } from "@/components/ui/marquee";
import { MARQUEE_WORDS } from "@/features/landing/data/landing";

export function MarqueeBand() {
  return (
    <section className="border-y border-border bg-brand-charcoal py-5 text-brand-cream">
      <Marquee pauseOnHover className="[--duration:22s]">
        {MARQUEE_WORDS.map((w) => (
          <span
            key={w}
            className="mx-6 inline-flex items-center gap-3 font-heading text-2xl font-semibold"
          >
            <Asterisk className="size-5 text-brand-lime" /> {w}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
