// Static content for the About feature. Swap the copy + photo here — the
// components consume this typed data (data ≠ presentation, AGENTS.md rule 5).

export type AboutContent = {
  eyebrow: string;
  name: string;
  role: string;
  location: string;
  photo: { src: string; alt: string };
  paragraphs: string[];
};

export const ABOUT: AboutContent = {
  eyebrow: "About me",
  name: "Muhammad Fauzan",
  role: "Software Engineer",
  location: "Indonesia",
  photo: {
    // Drop your own image in /public and point this at it (e.g. "/me.jpg").
    src: "/me.svg",
    alt: "Portrait of Muhammad Fauzan",
  },
  paragraphs: [
    "Hi, I'm Muhammad Fauzan — a developer who loves turning ideas into fast, polished, and playful web experiences. I care about the details: motion that feels right, layouts that breathe, and code that stays clean.",
    "I work mostly across the modern web stack, blending strong frontend craft with a solid understanding of what happens behind the scenes. When I'm not shipping, I'm usually exploring new tools, animations, and design ideas.",
  ],
};
