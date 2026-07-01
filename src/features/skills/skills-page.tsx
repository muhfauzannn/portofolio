import { ArrowUpRight } from "lucide-react";
import { SiGithub } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/layout/site-nav";
import { MagneticCursor } from "@/components/motion/magnetic-cursor";
import { Reveal } from "@/components/motion/reveal";
import { SkillsFan } from "@/features/skills/components/skills-fan";
import { GithubContributions } from "@/features/skills/components/github-contributions";
import { GITHUB_USERNAME } from "@/features/skills/data/skills";

/**
 * Skills feature — the fanned tool cards plus a live GitHub contribution graph.
 */
export function SkillsPage() {
  return (
    <div className="relative flex min-h-full flex-col">
      <MagneticCursor />
      <SiteNav />

      <main className="flex-1">
        {/* Tools */}
        <section className="overflow-hidden px-4 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="font-script text-2xl text-brand-purple sm:text-3xl">
                What I work with
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-1 font-heading text-4xl font-bold tracking-tighter text-balance sm:text-6xl">
                Skills &amp; Tools
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground text-pretty">
                The tools I reach for when designing and building for the web.
                Hover a card to see what it is.
              </p>
            </Reveal>
          </div>

          <SkillsFan />
        </section>

        {/* GitHub contributions */}
        <section className="px-4 pb-28 sm:pb-36">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Reveal>
                  <p className="font-script text-2xl text-brand-purple sm:text-3xl">
                    A year of building
                  </p>
                </Reveal>
                <Reveal delay={80}>
                  <h2 className="mt-1 font-heading text-3xl font-bold tracking-tighter text-balance sm:text-4xl">
                    GitHub Contributions
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={120}>
                <Button size="pill" asChild>
                  <a
                    href={`https://github.com/${GITHUB_USERNAME}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiGithub />
                    Visit my GitHub
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
              </Reveal>
            </div>

            <Reveal
              delay={160}
              className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-7"
            >
              <GithubContributions username={GITHUB_USERNAME} />
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
