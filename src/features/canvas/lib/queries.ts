import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

/** A single gallery photo positioned on the infinite canvas. */
export type CanvasPhoto = {
  id: string;
  imageUrl: string;
  alt: string;
  x: number;
  y: number;
  width: number;
  rotation: number;
  position: number;
};

/** A freehand scribble — a polyline of points in canvas space. */
export type CanvasDoodle = {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  position: number;
};

/** All canvas photos, in paint order. Cached under the `canvas` tag. */
export const getCanvasPhotos = unstable_cache(
  async (): Promise<CanvasPhoto[]> => {
    const rows = await db
      .select()
      .from(schema.canvasPhoto)
      .orderBy(asc(schema.canvasPhoto.position));
    return rows.map((r) => ({
      id: r.id,
      imageUrl: r.imageUrl,
      alt: r.alt,
      x: r.x,
      y: r.y,
      width: r.width,
      rotation: r.rotation,
      position: r.position,
    }));
  },
  ["canvas-photos-all"],
  { tags: [CACHE_TAGS.canvas] },
);

/** All canvas doodles, in paint order. Cached under the `canvas` tag. */
export const getCanvasDoodles = unstable_cache(
  async (): Promise<CanvasDoodle[]> => {
    const rows = await db
      .select()
      .from(schema.canvasDoodle)
      .orderBy(asc(schema.canvasDoodle.position));
    return rows.map((r) => ({
      id: r.id,
      points: r.points,
      color: r.color,
      strokeWidth: r.strokeWidth,
      position: r.position,
    }));
  },
  ["canvas-doodles-all"],
  { tags: [CACHE_TAGS.canvas] },
);
