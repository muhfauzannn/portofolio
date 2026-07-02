import { Reveal } from "@/components/motion/reveal";
import { ProjectsCarousel } from "@/features/projects/components/projects-carousel";
import { PROJECTS_CONTENT } from "@/features/projects/data/projects";

/**
 * Projects feature — a section header over a 3D coverflow carousel. The header
 * is a Server Component; the interactive carousel is a client leaf.
 */
export function ProjectsPage() {
  const { eyebrow, heading, projects } = PROJECTS_CONTENT;

  return (
    <section
      id="projects"
      className="scroll-mt-28 overflow-hidden bg-brand-charcoal px-4 text-brand-cream sm:py-28"
    >
      <div className="mx-auto max-w-6xl text-center">
        <Reveal>
          <p className="font-script text-2xl text-brand-lime sm:text-3xl">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-1 font-heading text-4xl font-bold tracking-tighter text-balance sm:text-6xl">
            {heading}
          </h2>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <ProjectsCarousel projects={projects} />
      </Reveal>
    </section>
  );
}
