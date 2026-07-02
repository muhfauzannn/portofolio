// Static content for the Projects feature. Swap the entries here — the
// components consume this typed data (data ≠ presentation, AGENTS.md rule 5).

// A single tech-stack entry. `slug` is the simple-icons slug used to load the
// logo from https://cdn.simpleicons.org/<slug> (see TechBadge).
export type TechItem = {
  name: string;
  slug: string;
};

// A collaborator on the project. `href` (optional) links to their profile.
export type Contributor = {
  name: string;
  role: string;
  href?: string;
};

export type Project = {
  // URL segment for the detail route: /projects/<slug>.
  slug: string;
  name: string;
  // One-line summary shown under the title on the detail page.
  tagline: string;
  // Longer overview paragraph(s).
  overview: string;
  // Release / build year, e.g. "2025".
  year: string;
  // Category label, e.g. "Web app", "Open source".
  type: string;
  // Tech stack with logos (rendered from simple-icons).
  techStack: TechItem[];
  // Other people who worked on it (empty for solo projects).
  contributors: Contributor[];
  // What the project achieved — rendered as a bullet list.
  impact: string[];
  // Takeaways — rendered as a bullet list.
  learnings: string[];
  // Link to the live project or its repo.
  href: string;
  // Optional source-code link, shown as a secondary action.
  repo?: string;
  // Cover screenshot for the carousel. Drop a file in /public and point here
  // (e.g. "/projects/sentr.png"). When omitted, a styled placeholder renders.
  image?: string;
  // Detail-page gallery. When empty, a styled placeholder renders instead.
  images: string[];
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
      slug: "sentr",
      name: "Sentr",
      tagline: "Lightweight error tracking for indie teams.",
      overview:
        "Sentr captures exceptions from web and server runtimes, groups them into issues, and surfaces the ones that actually matter. Built to give small teams the essentials of a full observability suite without the price tag or the noise.",
      year: "2025",
      type: "Web app",
      techStack: [
        { name: "Next.js", slug: "nextdotjs" },
        { name: "tRPC", slug: "trpc" },
        { name: "PostgreSQL", slug: "postgresql" },
      ],
      contributors: [
        { name: "Aditya Rahman", role: "Backend", href: "#" },
        { name: "Sarah Lin", role: "Design", href: "#" },
      ],
      impact: [
        "Cut mean time to detection from hours to under a minute for the pilot team.",
        "Grouped 40k+ raw events into ~200 actionable issues per week.",
        "Shipped a type-safe SDK adopted across three internal services.",
      ],
      learnings: [
        "Designing an ingestion pipeline that stays cheap under bursty traffic.",
        "Modelling error fingerprints so unrelated stack traces never collide.",
        "Keeping a tRPC API ergonomic as the surface area grew.",
      ],
      href: "#",
      repo: "#",
      images: [],
    },
    {
      slug: "loopmail",
      name: "Loopmail",
      tagline: "A calmer inbox built around threads, not messages.",
      overview:
        "Loopmail reimagines email as a stream of conversations. It batches low-priority mail, collapses noisy threads, and gives you a single keyboard-driven surface to triage everything in one pass.",
      year: "2024",
      type: "Web app",
      techStack: [
        { name: "React", slug: "react" },
        { name: "Node.js", slug: "nodedotjs" },
        { name: "Tailwind CSS", slug: "tailwindcss" },
      ],
      contributors: [{ name: "Devin Park", role: "Frontend", href: "#" }],
      impact: [
        "Reduced average triage time by ~35% in a 20-person beta.",
        "Handled 1M+ synced messages without a full re-index.",
        "Reached a fully keyboard-navigable inbox with zero mouse required.",
      ],
      learnings: [
        "Building an offline-first sync layer with optimistic updates.",
        "Virtualising very long thread lists without dropping frames.",
        "Balancing real-time delivery against battery and bandwidth.",
      ],
      href: "#",
      repo: "#",
      images: [],
    },
    {
      slug: "foodtruck-finder",
      name: "Foodtruck Finder",
      tagline: "Find the trucks near you, in real time.",
      overview:
        "A map-first app that tracks food trucks as they move through the city. Vendors update their location and menu from a lightweight dashboard; hungry users get live pins, filters, and opening-hours at a glance.",
      year: "2024",
      type: "Web app",
      techStack: [
        { name: "Next.js", slug: "nextdotjs" },
        { name: "Mapbox", slug: "mapbox" },
        { name: "Supabase", slug: "supabase" },
      ],
      contributors: [],
      impact: [
        "Onboarded 60+ vendors across two cities in the first month.",
        "Served live location updates to users with sub-second latency.",
        "Grew to 5k weekly active users on a zero-marketing launch.",
      ],
      learnings: [
        "Streaming geospatial updates efficiently with Supabase realtime.",
        "Clustering hundreds of map markers without janky pan/zoom.",
        "Designing a dashboard simple enough to use one-handed at a truck.",
      ],
      href: "#",
      repo: "#",
      images: [],
    },
    {
      slug: "devboard",
      name: "DevBoard",
      tagline: "Real-time boards for engineering teams.",
      overview:
        "DevBoard is a collaborative planning board with live cursors, instant card updates, and GitHub sync. It keeps standups short by making the state of work visible to everyone the moment it changes.",
      year: "2023",
      type: "Web app",
      techStack: [
        { name: "Next.js", slug: "nextdotjs" },
        { name: "Prisma", slug: "prisma" },
        { name: "Socket.IO", slug: "socketdotio" },
      ],
      contributors: [
        { name: "Maya Chen", role: "Product", href: "#" },
        { name: "Tomas Vega", role: "Infra", href: "#" },
      ],
      impact: [
        "Synced board state across clients in under 100ms.",
        "Replaced three separate standup tools for the founding team.",
        "Two-way GitHub sync kept 1k+ issues in step automatically.",
      ],
      learnings: [
        "Resolving concurrent edits without clobbering someone's work.",
        "Scaling websocket rooms as boards and members multiplied.",
        "Keeping an event log that can rebuild board state on reconnect.",
      ],
      href: "#",
      repo: "#",
      images: [],
    },
    {
      slug: "pixels",
      name: "Pixels",
      tagline: "A collaborative pixel canvas that scales.",
      overview:
        "Pixels is an open, real-time canvas where thousands of people place tiles at once. The backend batches writes, rate-limits per user, and streams the shared grid to everyone watching.",
      year: "2023",
      type: "Open source",
      techStack: [
        { name: "Go", slug: "go" },
        { name: "Redis", slug: "redis" },
        { name: "Docker", slug: "docker" },
      ],
      contributors: [],
      impact: [
        "Sustained 10k concurrent painters during a launch event.",
        "Kept tile writes durable while batching to a single Redis stream.",
        "Open-sourced and forked 300+ times in the first quarter.",
      ],
      learnings: [
        "Designing a write path that survives sudden 10x traffic spikes.",
        "Using Redis structures to model a large shared grid cheaply.",
        "Packaging the whole stack so anyone can self-host in one command.",
      ],
      href: "#",
      repo: "#",
      images: [],
    },
  ],
};

// Look up a single project by its URL slug. Returns undefined when unknown so
// the route can respond with notFound().
export function getProject(slug: string): Project | undefined {
  return PROJECTS_CONTENT.projects.find((project) => project.slug === slug);
}
