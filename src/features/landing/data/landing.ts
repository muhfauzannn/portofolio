import {
  Boxes,
  Layers,
  MousePointer2,
  Sparkles,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Static content for the landing page.
 * Kept separate from presentation so copy/data can change without touching
 * component markup (separation of concerns).
 */

export type AssetItem = {
  name: string;
  tag: string;
  icon: LucideIcon;
  /** Resting rotation for the scattered hero cards. */
  tilt: string;
};

export const ASSETS: AssetItem[] = [
  { name: "MatterOS", tag: "3D", icon: Boxes, tilt: "-6deg" },
  { name: "Momentum Hover", tag: "Motion", icon: MousePointer2, tilt: "4deg" },
  { name: "The Vault", tag: "Kit", icon: Layers, tilt: "-3deg" },
  { name: "Buttons", tag: "UI", icon: Wand2, tilt: "6deg" },
];

export type Photo = {
  /** Drop the file in /public and set e.g. "/me.jpg". Empty → shows a placeholder. */
  src?: string;
  alt: string;
  caption: string;
};

/** Stacked Polaroids in the hero — add, remove or reorder freely. */
export const PHOTOS: Photo[] = [
  { src: "", alt: "Portrait one", caption: "That's me" },
  { src: "", alt: "Portrait two", caption: "On set" },
  { src: "", alt: "Portrait three", caption: "IRL" },
];

export type ShowcaseItem = {
  title: string;
  icon: LucideIcon;
  /** Screen tint — maps to a brand token in the component. */
  tone: "charcoal" | "cream" | "purple" | "lime";
  /** Resting rotation so the reel feels hand-scattered. */
  tilt: string;
};

/** Tilted "screen" reel that scrolls infinitely under the hero. */
export const SHOWCASE: ShowcaseItem[] = [
  { title: "Logo Wall Cycle", icon: Boxes, tone: "charcoal", tilt: "-5deg" },
  { title: "Falling 2D Objects", icon: Sparkles, tone: "cream", tilt: "4deg" },
  { title: "3D Image Carousel", icon: Layers, tone: "charcoal", tilt: "-3deg" },
  { title: "Momentum Hover", icon: MousePointer2, tone: "lime", tilt: "5deg" },
  { title: "Pixelate Render", icon: Wand2, tone: "purple", tilt: "-4deg" },
  { title: "Face Follow Cursor", icon: Zap, tone: "cream", tilt: "3deg" },
];

export type VaultItem = {
  name: string;
  meta: string;
  icon: LucideIcon;
};

export const VAULT: VaultItem[] = [
  { name: "Page Transitions", meta: "12 components", icon: Zap },
  { name: "Scroll Systems", meta: "8 components", icon: MousePointer2 },
  { name: "3D Primitives", meta: "20 components", icon: Boxes },
  { name: "Cursor Kit", meta: "6 components", icon: Sparkles },
  { name: "Grid Layouts", meta: "14 components", icon: Layers },
];

export type UpdateItem = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

export const UPDATES: UpdateItem[] = [
  { title: "Momentum hover v2", detail: "Physics-based, 60fps", icon: Zap },
  { title: "Cursor magnet kit", detail: "5 new presets", icon: MousePointer2 },
  { title: "Grid engine", detail: "Draggable layouts", icon: Layers },
];

export const LOCATIONS = [
  "Berlin",
  "Tokyo",
  "Lagos",
  "Austin",
  "São Paulo",
  "Oslo",
];

export const MARQUEE_WORDS = [
  "Motion",
  "3D",
  "Cursors",
  "Transitions",
  "Grids",
  "Shaders",
  "Scroll",
  "Icons",
];
