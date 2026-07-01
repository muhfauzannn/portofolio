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
