import Image from "next/image";

import { type TechItem } from "@/features/projects/data/projects";

/**
 * A single tech-stack entry: a pill with the tool's uploaded logo + name. When
 * no logo has been uploaded yet, the pill shows just the name (DESIGN.md — pill
 * badges, minimal colour). Server-safe.
 */
export function TechBadge({ name, logoUrl }: TechItem) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt=""
          aria-hidden
          width={16}
          height={16}
          className="size-4 object-contain"
        />
      ) : null}
      {name}
    </span>
  );
}
