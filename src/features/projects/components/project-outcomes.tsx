import { Reveal } from "@/components/motion/reveal";
import { type Project } from "@/features/projects/data/projects";

/**
 * Impact + what I learned — two mono-labelled bullet lists, side by side on
 * desktop. Markers use the lime accent to keep the eye moving down the page.
 */
export function ProjectOutcomes({ project }: { project: Project }) {
  return (
    <section className="mx-auto mt-16 grid max-w-4xl gap-12 px-4 sm:mt-24 lg:grid-cols-2">
      <BulletList label="Impact" items={project.impact} />
      <BulletList label="What I learned" items={project.learnings} delay={80} />
    </section>
  );
}

function BulletList({
  label,
  items,
  delay = 0,
}: {
  label: string;
  items: string[];
  delay?: number;
}) {
  return (
    <div>
      <Reveal delay={delay}>
        <p className="font-mono text-[0.7rem] tracking-widest text-muted-foreground">
          {label}
        </p>
      </Reveal>
      <ul className="mt-5 flex flex-col gap-4">
        {items.map((item, i) => (
          <Reveal key={item} as="li" delay={delay + 60 * (i + 1)}>
            <span className="flex gap-3 text-base text-foreground/90 sm:text-lg">
              <span
                aria-hidden
                className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-lime"
              />
              {item}
            </span>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
