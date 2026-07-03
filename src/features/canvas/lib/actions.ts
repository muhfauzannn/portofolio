"use server";

import { asc, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { uploadToR2 } from "@/lib/r2";
// Shared auth guard — the CMS session module doubles as the app-wide guard.
import { requireSession } from "@/features/admin/lib/session";
import type {
  CanvasDoodle,
  CanvasPhoto,
} from "@/features/canvas/lib/queries";

/**
 * Uploads a photo to R2 and places it on the canvas. If the form carries an
 * `x`/`y` (a drag-and-drop drop point) the photo lands exactly there; otherwise
 * it drops on a ring around the origin — close to the centerpiece statement
 * (never far from the content) but off the text. Admin-only. Returns the created
 * row so the client can keep editing it.
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

  // Prefer an explicit drop point; else a ring (radius ~360–560) around origin.
  const xRaw = formData.get("x");
  const yRaw = formData.get("y");
  const dropX = Number(xRaw);
  const dropY = Number(yRaw);
  const hasDrop =
    typeof xRaw === "string" &&
    xRaw !== "" &&
    typeof yRaw === "string" &&
    yRaw !== "" &&
    Number.isFinite(dropX) &&
    Number.isFinite(dropY);
  const angle = Math.random() * Math.PI * 2;
  const radius = 360 + Math.random() * 200;

  // Rotation may be supplied by the client (so an optimistic preview matches the
  // saved photo exactly); otherwise pick a small random tilt.
  const rotRaw = formData.get("rotation");
  const rotation =
    typeof rotRaw === "string" && rotRaw !== "" && Number.isFinite(Number(rotRaw))
      ? Math.round(Number(rotRaw))
      : Math.round((Math.random() - 0.5) * 16);

  const [row] = await db
    .insert(schema.canvasPhoto)
    .values({
      imageUrl,
      alt: "",
      x: hasDrop ? Math.round(dropX) : Math.round(Math.cos(angle) * radius),
      y: hasDrop ? Math.round(dropY) : Math.round(Math.sin(angle) * radius),
      width: 240,
      rotation,
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

/** Persists a completed freehand stroke. Admin-only. Points are rounded and
 *  capped to keep the payload small. Returns the created row. */
export async function addCanvasDoodle(input: {
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
}): Promise<CanvasDoodle> {
  await requireSession();
  const points = input.points
    .slice(0, 3000)
    .map((p) => ({ x: Math.round(p.x), y: Math.round(p.y) }));
  if (points.length < 2) throw new Error("Stroke too short");

  const existing = await db
    .select({ position: schema.canvasDoodle.position })
    .from(schema.canvasDoodle)
    .orderBy(asc(schema.canvasDoodle.position));
  const nextPos = existing.length
    ? Math.max(...existing.map((r) => r.position)) + 1
    : 0;

  const [row] = await db
    .insert(schema.canvasDoodle)
    .values({
      points,
      color: input.color,
      strokeWidth: Math.round(input.strokeWidth),
      position: nextPos,
    })
    .returning();

  revalidateTag(CACHE_TAGS.canvas, "max");
  return {
    id: row.id,
    points: row.points,
    color: row.color,
    strokeWidth: row.strokeWidth,
    position: row.position,
  };
}

/** Removes a single stroke. Admin-only. */
export async function deleteCanvasDoodle(id: string): Promise<void> {
  await requireSession();
  await db.delete(schema.canvasDoodle).where(eq(schema.canvasDoodle.id, id));
  revalidateTag(CACHE_TAGS.canvas, "max");
}
