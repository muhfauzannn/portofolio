// Type definitions for the Projects feature. The content itself now lives in
// the database and is read through `lib/queries.ts`; components still consume
// these shapes (data ≠ presentation, AGENTS.md rule 5).

// A single tech-stack entry. `logoUrl` points at an uploaded logo in R2
// (empty → a neutral placeholder renders; see TechBadge).
export type TechItem = {
  name: string;
  logoUrl: string;
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
  // Tech stack with uploaded logos.
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
  // Cover screenshot for the carousel (uploaded to R2). When empty, a styled
  // placeholder renders.
  image?: string;
  // Detail-page gallery. When empty, a styled placeholder renders instead.
  images: string[];
};
