"use server";

import { asc, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createR2PresignedUpload } from "@/lib/r2";
// Shared auth guard — the CMS session module doubles as the app-wide guard.
import { requireSession } from "@/features/admin/lib/session";
import type {
  CanvasDoodle,
  CanvasPhoto,
} from "@/features/canvas/lib/queries";

// Image types the browser can upload straight to R2. HEIC/HEIF are absent on
// purpose — the client transcodes them to JPEG before requesting a URL, since
// the server no longer sees the bytes to transcode them itself.
const ALLOWED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

/**
 * Step 1 of a direct-to-R2 upload: hands the browser a short-lived presigned
 * PUT URL so it can upload the (possibly large) file itself, bypassing Vercel's
 * 4.5 MB function-body limit. Admin-only. The client then calls
 * `saveCanvasPhoto` with the returned public URL.
 */
export async function createCanvasUploadUrl(input: {
  ext: string;
  contentType: string;
}): Promise<{ uploadUrl: string; url: string; contentType: string }> {
  await requireSession();
  if (!ALLOWED_UPLOAD_TYPES.has(input.contentType)) {
    throw new Error("Unsupported image type");
  }
  return createR2PresignedUpload({
    keyPrefix: "canvas",
    ext: input.ext,
    contentType: input.contentType,
  });
}

/**
 * Step 2 of a direct-to-R2 upload: records a photo already uploaded to R2 and
 * places it on the canvas. If `x`/`y` are given (a drag-and-drop drop point) the
 * photo lands exactly there; otherwise it drops on a ring around the origin —
 * close to the centerpiece statement but off the text. Admin-only. Returns the
 * created row so the client can keep editing it.
 */
export async function saveCanvasPhoto(input: {
  imageUrl: string;
  x?: number;
  y?: number;
  rotation?: number;
}): Promise<CanvasPhoto> {
  await requireSession();
  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (
    typeof input.imageUrl !== "string" ||
    (publicBase && !input.imageUrl.startsWith(publicBase))
  ) {
    // Only accept URLs from our own R2 bucket — never store an arbitrary URL.
    throw new Error("Invalid image URL");
  }
  const imageUrl = input.imageUrl;

  const existing = await db
    .select({ position: schema.canvasPhoto.position })
    .from(schema.canvasPhoto)
    .orderBy(asc(schema.canvasPhoto.position));
  const nextPos = existing.length
    ? Math.max(...existing.map((r) => r.position)) + 1
    : 0;

  // Prefer an explicit drop point; else a ring (radius ~360–560) around origin.
  const hasDrop =
    Number.isFinite(input.x ?? NaN) && Number.isFinite(input.y ?? NaN);
  const angle = Math.random() * Math.PI * 2;
  const radius = 360 + Math.random() * 200;

  // Rotation may be supplied by the client (so an optimistic preview matches the
  // saved photo exactly); otherwise pick a small random tilt.
  const rotation = Number.isFinite(input.rotation ?? NaN)
    ? Math.round(input.rotation as number)
    : Math.round((Math.random() - 0.5) * 16);

  const [row] = await db
    .insert(schema.canvasPhoto)
    .values({
      imageUrl,
      alt: "",
      x: hasDrop ? Math.round(input.x as number) : Math.round(Math.cos(angle) * radius),
      y: hasDrop ? Math.round(input.y as number) : Math.round(Math.sin(angle) * radius),
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
