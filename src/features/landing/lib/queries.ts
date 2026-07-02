import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";

export type HeroSocial = {
  label: string;
  url: string;
  // Uploaded icon (R2). Empty → first letter of the label renders.
  iconUrl: string;
};

export type HeroPhoto = {
  // Uploaded image (R2) or a /public path. Empty → placeholder card.
  src: string;
  alt: string;
  caption: string;
};

/** Hero social links, ordered. Cached under the `hero` tag. */
export const getHeroSocials = unstable_cache(
  async (): Promise<HeroSocial[]> => {
    const rows = await db
      .select()
      .from(schema.heroSocial)
      .orderBy(asc(schema.heroSocial.position));
    return rows.map((r) => ({ label: r.label, url: r.url, iconUrl: r.iconUrl }));
  },
  ["hero-socials"],
  { tags: [CACHE_TAGS.hero] },
);

/**
 * Resume link shown on the hero button. Falls back to the bundled PDF when the
 * setting is empty/unset. Cached under the `hero` tag.
 */
export const getResumeUrl = unstable_cache(
  async (): Promise<string> => {
    const [row] = await db.select().from(schema.siteSetting).limit(1);
    return row?.resumeUrl || "/resume.pdf";
  },
  ["resume-url"],
  { tags: [CACHE_TAGS.hero] },
);

/** Stacked hero photos, ordered. Cached under the `hero` tag. */
export const getHeroPhotos = unstable_cache(
  async (): Promise<HeroPhoto[]> => {
    const rows = await db
      .select()
      .from(schema.heroPhoto)
      .orderBy(asc(schema.heroPhoto.position));
    return rows.map((r) => ({ src: r.imageUrl, alt: r.alt, caption: r.caption }));
  },
  ["hero-photos"],
  { tags: [CACHE_TAGS.hero] },
);
