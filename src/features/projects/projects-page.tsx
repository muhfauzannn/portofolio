import { Reveal } from "@/components/motion/reveal";
import { ProjectsCarousel } from "@/features/projects/components/projects-carousel";
import { getProjects } from "@/features/projects/lib/queries";

// Fixed section header (chrome, not user-editable).
const PROJECTS_HEADER = { eyebrow: "A glimpse of my work", heading: "Projects" };

/**
 * Projects feature — a section header over a 3D coverflow carousel. Server
 * Component: reads the (cached) projects; the interactive carousel is a client
 * leaf.
 */
export async function ProjectsPage() {
  const { eyebrow, heading } = PROJECTS_HEADER;
  const projects = await getProjects();

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

      {projects.length > 0 ? (
        <Reveal delay={140}>
          <ProjectsCarousel projects={projects} />
        </Reveal>
      ) : null}
    </section>
  );
}
