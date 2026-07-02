import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { ProjectHero } from "@/features/projects/components/project-hero";
import { ProjectGallery } from "@/features/projects/components/project-gallery";
import { ProjectDetails } from "@/features/projects/components/project-details";
import { ProjectOverview } from "@/features/projects/components/project-overview";
import { ProjectOutcomes } from "@/features/projects/components/project-outcomes";
import { type Project } from "@/features/projects/data/projects";

/**
 * Project detail — composition root for /projects/<slug>. Assembles the
 * self-contained sections over the shared chrome. Server Component; only the
 * nav/cursor leaves opt into the client.
 */
export function ProjectDetailPage({ project }: { project: Project }) {
  return (
    <div className="relative flex min-h-full flex-col">
      <MagneticCursor />
      <SiteNav />

      <main className="flex-1 pb-24">
        <ProjectHero project={project} />
        <ProjectGallery images={project.images} name={project.name} />
        <ProjectDetails project={project} />
        <ProjectOverview overview={project.overview} />
        <ProjectOutcomes project={project} />
      </main>

      <SiteFooter />
    </div>
  );
}
