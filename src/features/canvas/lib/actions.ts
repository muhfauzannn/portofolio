"use server";

import { asc, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { uploadToR2 } from "@/lib/r2";
// Shared auth guard — the CMS session module doubles as the app-wide guard.
import { requireSession } from "@/features/admin/lib/session";
import type { CanvasPhoto } from "@/features/canvas/lib/queries";

/**
 * Uploads a photo to R2 and inserts it near the canvas origin with a small
 * random offset + tilt so new photos land in view without stacking exactly.
 * Admin-only. Returns the created row so the client can keep editing it.
 */
export async function addCanvasPhoto(formData: FormData): Promise<CanvasPhoto> {
  await requireSession();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  const imageUrl = await uploadToR2(file, "canvas");

  const existing = await db
    .select({ position: schema.canvasPhoto.position })
    .from(schema.canvasPhoto)
    .orderBy(asc(schema.canvasPhoto.position));
  const nextPos = existing.length
    ? Math.max(...existing.map((r) => r.position)) + 1
    : 0;

  const [row] = await db
    .insert(schema.canvasPhoto)
    .values({
      imageUrl,
      alt: "",
      x: Math.round((Math.random() - 0.5) * 240),
      y: Math.round((Math.random() - 0.5) * 160),
      width: 240,
      rotation: Math.round((Math.random() - 0.5) * 16),
      position: nextPos,
    })
    .returning();

  revalidateTag(CACHE_TAGS.canvas, "max");
  return {
    id: row.id,
    imageUrl: row.imageUrl,
    alt: row.alt,
    x: row.x,
    y: row.y,
    width: row.width,
    rotation: row.rotation,
    position: row.position,
  };
}

/** Persists a photo's placement (position/size/rotation). Admin-only. */
export async function updateCanvasPhoto(
  id: string,
  values: { x: number; y: number; width: number; rotation: number },
): Promise<void> {
  await requireSession();
  await db
    .update(schema.canvasPhoto)
    .set(values)
    .where(eq(schema.canvasPhoto.id, id));
  revalidateTag(CACHE_TAGS.canvas, "max");
}

/** Removes a photo from the canvas. Admin-only. */
export async function deleteCanvasPhoto(id: string): Promise<void> {
  await requireSession();
  await db.delete(schema.canvasPhoto).where(eq(schema.canvasPhoto.id, id));
  revalidateTag(CACHE_TAGS.canvas, "max");
}
