import { Image } from "@/components/ui/image";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Project gallery — the lead screenshot full-width, any extras in a two-up grid
 * below. Media cards keep the crisp radius tier (DESIGN.md §2C). When no images
 * are supplied, a single styled placeholder stands in.
 */
export function ProjectGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  return (
    <section className="mx-auto mt-14 max-w-5xl px-4 sm:mt-20">
      {images.length === 0 ? (
        <Reveal>
          <GalleryPlaceholder name={name} />
        </Reveal>
      ) : (
        <div className="flex flex-col gap-4">
          <Reveal>
            <Shot src={images[0]} name={name} priority />
          </Reveal>
          {images.length > 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.slice(1).map((src, i) => (
                <Reveal key={src} delay={80 * (i + 1)}>
                  <Shot src={src} name={name} />
                </Reveal>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function Shot({
  src,
  name,
  priority,
}: {
  src: string;
  name: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-border bg-brand-charcoal">
      <Image
        src={src}
        alt={`${name} screenshot`}
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, 1024px"
        className="object-cover"
      />
    </div>
  );
}

function GalleryPlaceholder({ name }: { name: string }) {
  return (
    <div
      className={cn(
        "relative flex aspect-16/10 w-full flex-col justify-between overflow-hidden rounded-lg border border-border p-6",
        "bg-linear-to-br from-brand-purple/25 via-brand-charcoal to-brand-charcoal",
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-brand-cream/20" />
        <span className="size-2.5 rounded-full bg-brand-cream/20" />
        <span className="size-2.5 rounded-full bg-brand-cream/20" />
        <span className="ml-2 font-mono text-[0.65rem] tracking-widest text-brand-cream/50 uppercase">
          {`// ${name}`}
        </span>
      </div>
      <p className="font-heading text-4xl font-bold tracking-tight text-brand-cream sm:text-5xl">
        {name}
      </p>
    </div>
  );
}
