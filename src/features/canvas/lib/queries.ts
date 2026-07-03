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
