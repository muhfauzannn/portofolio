import { ArrowLeft, ArrowUpRight, Code } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { type Project } from "@/features/projects/data/projects";

/**
 * Detail hero — back link, project type eyebrow, big title, tagline, and the
 * primary actions (live link + optional source). Left-aligned and airy to match
 * the minimalist landing rhythm.
 */
export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="mx-auto max-w-4xl px-4 pt-10 sm:pt-16">
      <Reveal>
        <TransitionLink
          href="/#projects"
          className="group inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          All projects
        </TransitionLink>
      </Reveal>

      <Reveal delay={80}>
        <p className="mt-8 font-script text-2xl text-brand-purple sm:text-3xl">
          {project.type}
        </p>
      </Reveal>

      <Reveal delay={120}>
        <h1 className="mt-1 font-heading text-5xl font-bold tracking-tighter text-balance sm:text-7xl">
          {project.name}
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl">
          {project.tagline}
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="pill-lg">
            <a href={project.href} target="_blank" rel="noopener noreferrer">
              View project
              <ArrowUpRight />
            </a>
          </Button>
          {project.repo ? (
            <Button asChild variant="outline" size="pill-lg">
              <a href={project.repo} target="_blank" rel="noopener noreferrer">
                <Code />
                Source
              </a>
            </Button>
          ) : null}
        </div>
      </Reveal>
    </header>
  );
}
