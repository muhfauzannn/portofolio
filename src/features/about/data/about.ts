// Type definitions for the About feature. Content now lives in the database
// and is read through `lib/queries.ts` (data ≠ presentation, AGENTS.md rule 5).

export type Education = {
  // Small heading shown above the card, e.g. "Currently studying at".
  label: string;
  institution: string;
  // Uploaded logo (R2). If empty, the institution's initials show instead.
  logo: { src: string; alt: string };
  degree: string;
  years: string;
};

export type AboutContent = {
  eyebrow: string;
  name: string;
  role: string;
  location: string;
  photo: { src: string; alt: string };
  paragraphs: string[];
  education: Education;
};
