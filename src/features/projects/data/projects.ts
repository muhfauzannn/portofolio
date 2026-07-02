// Static content for the Projects feature. Swap the entries here — the
// components consume this typed data (data ≠ presentation, AGENTS.md rule 5).

export type Project = {
  name: string;
  // Short stack labels, e.g. ["Next.js", "tRPC", "Postgres"].
  tech: string[];
  // Link to the live project or its repo.
  href: string;
  // Drop a screenshot in /public and point `image` at it (e.g.
  // "/projects/sentr.png"). When omitted, a styled placeholder renders instead.
  image?: string;
};

export type ProjectsContent = {
  eyebrow: string;
  heading: string;
  projects: Project[];
};

export const PROJECTS_CONTENT: ProjectsContent = {
  eyebrow: "Selected work",
  heading: "Projects",
  projects: [
    {
      name: "Sentr",
      tech: ["Next.js", "tRPC", "Postgres"],
      href: "#",
    },
    {
      name: "Loopmail",
      tech: ["React", "Node", "Tailwind"],
      href: "#",
    },
    {
      name: "Foodtruck Finder",
      tech: ["Next.js", "MapLibre", "Supabase"],
      href: "#",
    },
    {
      name: "DevBoard",
      tech: ["Next.js", "Prisma", "WebSocket"],
      href: "#",
    },
    {
      name: "Pixels",
      tech: ["Go", "Redis", "Docker"],
      href: "#",
    },
  ],
};
