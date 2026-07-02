// Static content for the Experience feature. Swap the entries here — the
// components consume this typed data (data ≠ presentation, AGENTS.md rule 5).

export type ExperienceItem = {
  // Time range for the role, e.g. "2023 — Present".
  period: string;
  institution: string;
  role: string;
  // Drop a logo in /public and point `src` at it (e.g. "/logos/acme.svg").
  // If the image is missing, the institution's initials show instead.
  logo: { src: string; alt: string };
  description: string;
};

export type ExperienceContent = {
  eyebrow: string;
  heading: string;
  items: ExperienceItem[];
};

export const EXPERIENCE: ExperienceContent = {
  eyebrow: "Where I've worked",
  heading: "Experience",
  items: [
    {
      period: "2024 — Present",
      institution: "Universitas Indonesia",
      role: "Software Engineer",
      logo: {
        src: "/logo-ui.webp",
        alt: "Logo of Universitas Indonesia",
      },
      description:
        "Building and maintaining internal web platforms — shipping clean, accessible interfaces while keeping the codebase modular and fast.",
    },
    {
      period: "2023 — 2024",
      institution: "Freelance",
      role: "Web Developer",
      logo: {
        src: "",
        alt: "Freelance",
      },
      description:
        "Delivered end-to-end websites for small businesses, from design handoff to deployment, with a focus on polished motion and responsive layouts.",
    },
    {
      period: "2022 — 2023",
      institution: "Open Source",
      role: "DevOps Engineer",
      logo: {
        src: "",
        alt: "Open Source",
      },
      description:
        "Automated build and deployment pipelines, containerized services, and improved developer workflows across a handful of community projects.",
    },
  ],
};
