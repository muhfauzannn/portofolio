import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { TechBadge } from "@/features/projects/components/tech-badge";
import { type Project } from "@/features/projects/data/projects";

/**
 * At-a-glance spec — year, type, tech stack (with logos) and any other
 * contributors, laid out as an editorial list with hairline dividers: a mono
 * label on the left, the value on the right. No card chrome, to match the
 * minimalist landing rhythm.
 */
export function ProjectDetails({ project }: { project: Project }) {
  const { year, type, techStack, contributors } = project;

  return (
    <section className="mx-auto mt-14 max-w-4xl px-4 sm:mt-20">
      <dl className="border-t border-border">
        <Row label="Year">
          <span className="text-lg font-medium">{year}</span>
        </Row>

        <Row label="Project type">
          <span className="text-lg font-medium">{type}</span>
        </Row>

        <Row label="Tech stack">
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <TechBadge key={tech.name} {...tech} />
            ))}
          </div>
        </Row>

        {contributors.length > 0 ? (
          <Row label="Other contributors">
            <ul className="flex flex-col gap-2.5">
              {contributors.map((person) => (
                <li key={person.name}>
                  <Contributor {...person} />
                </li>
              ))}
            </ul>
          </Row>
        ) : null}
      </dl>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      as="div"
      className="grid gap-2 border-b border-border py-5 sm:grid-cols-[180px_1fr] sm:gap-8"
    >
      <dt className="pt-1 font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase">
        {label}
      </dt>
      <dd>{children}</dd>
    </Reveal>
  );
}

function Contributor({
  name,
  role,
  href,
}: {
  name: string;
  role: string;
  href?: string;
}) {
  const content = (
    <span className="flex items-baseline gap-2">
      <span className="font-medium">{name}</span>
      <span className="text-sm text-muted-foreground">{role}</span>
      {href ? (
        <ArrowUpRight className="size-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      ) : null}
    </span>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center transition-colors hover:text-brand-purple"
    >
      {content}
    </a>
  );
}
