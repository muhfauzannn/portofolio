import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import convertHeic from "heic-convert";

/**
 * Cloudflare R2 upload helper (S3-compatible).
 * All CMS images/logos go here; the public URL is stored in the DB.
 */

/** HEIC/HEIF (iPhone) isn't renderable in most browsers, so we transcode to
 *  JPEG on upload. Detected by MIME type or extension. */
function isHeic(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

let client: S3Client | null = null;

function getClient(): S3Client {
  if (client) return client;
  client = new S3Client({
    region: "auto",
    endpoint: `https://${required("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: required("R2_ACCESS_KEY_ID"),
      secretAccessKey: required("R2_SECRET_ACCESS_KEY"),
    },
  });
  return client;
}

function extensionFor(file: File): string {
  const fromName = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "";
  if (fromName) return fromName;
  const fromType = file.type.split("/").pop();
  return fromType || "bin";
}

/**
 * Uploads a File to R2 under `<keyPrefix>/<uuid>.<ext>` and returns its public
 * URL (built from R2_PUBLIC_URL). Throws if required env vars are missing.
 */
export async function uploadToR2(
  file: File,
  keyPrefix: string,
): Promise<string> {
  const publicBase = required("R2_PUBLIC_URL").replace(/\/$/, "");

  let body = Buffer.from(await file.arrayBuffer());
  let ext = extensionFor(file);
  let contentType = file.type || "application/octet-stream";

  // Transcode HEIC/HEIF → JPEG so uploaded photos render everywhere.
  if (isHeic(file)) {
    body = Buffer.from(
      await convertHeic({ buffer: body, format: "JPEG", quality: 0.9 }),
    );
    ext = "jpg";
    contentType = "image/jpeg";
  }

  const key = `${keyPrefix}/${randomUUID()}.${ext}`;

  await getClient().send(
    new PutObjectCommand({
      Bucket: required("R2_BUCKET"),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return `${publicBase}/${key}`;
}
