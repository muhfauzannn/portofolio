import { SiteNav } from "@/components/layout/site-nav";
import { Reveal } from "@/components/motion/reveal";

export type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * Bare mockup route used to test page transitions. Intentionally minimal —
 * real sections get promoted into their own feature later.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: PlaceholderPageProps) {
  return (
    <div className="relative flex min-h-full flex-col">
      <SiteNav />

      <main className="flex flex-1 items-center px-4">
        <section className="mx-auto max-w-3xl py-24 text-center sm:py-32">
          <Reveal>
            <p className="font-script text-2xl text-brand-purple sm:text-3xl">
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-2 font-heading text-6xl font-bold tracking-tighter text-balance sm:text-8xl">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">
              {description}
            </p>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
