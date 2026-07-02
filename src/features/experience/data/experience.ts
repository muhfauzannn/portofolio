// Types + static section header for the Experience feature. The list of
// institutions/roles now lives in the database (read via `lib/queries.ts`);
// the eyebrow/heading are fixed chrome, not user-editable.

// A single position held at an institution. One institution can hold several
// (a promotion / role change), rendered LinkedIn-style as a dotted sub-list.
export type ExperienceRole = {
  // Time range for the role, e.g. "2024 — Present".
  period: string;
  role: string;
  description: string;
};

export type ExperienceItem = {
  institution: string;
  // Uploaded logo (R2). If empty, the institution's initials show instead.
  logo: { src: string; alt: string };
  // Most recent role first.
  roles: ExperienceRole[];
};

// Fixed section header.
export const EXPERIENCE_HEADER = {
  eyebrow: "Where I've worked",
  heading: "Experience",
};
