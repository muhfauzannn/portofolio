import type { IconType } from "react-icons";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiNodedotjs,
  SiGit,
  SiFigma,
} from "react-icons/si";

// One skill = a label + its brand logo. `color` is the brand hex; leave it
// undefined for near-black marks (e.g. Next.js) so they inherit the theme's
// foreground and stay visible in both light and dark mode.
export type Skill = { name: string; Icon: IconType; color?: string };

// TODO: replace with your real stack — just edit this list.
export const SKILLS: Skill[] = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
  { name: "HTML5", Icon: SiHtml5, color: "#E34F26" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
  { name: "Git", Icon: SiGit, color: "#F05032" },
  { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
];

// GitHub username for the contributions calendar — change to yours.
export const GITHUB_USERNAME = "muhfauzannn";
