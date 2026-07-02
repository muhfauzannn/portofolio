import Image from "next/image";

import { type TechItem } from "@/features/projects/data/projects";

/**
 * A single tech-stack entry: a pill with the tool's logo + name. The logo is
 * loaded from the simple-icons CDN and tinted charcoal so the row reads as one
 * calm monochrome set (DESIGN.md — pill badges, minimal colour). Server-safe.
 */
export function TechBadge({ name, slug }: TechItem) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground">
      <Image
        // The `/1a1a1a` suffix recolours the icon to brand-charcoal.
        src={`https://cdn.simpleicons.org/${slug}/1a1a1a`}
        alt=""
        aria-hidden
        width={16}
        height={16}
        unoptimized
        className="size-4"
      />
      {name}
    </span>
  );
}
