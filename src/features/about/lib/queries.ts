import { unstable_cache } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { type AboutContent } from "@/features/about/data/about";

/** The About singleton, or null when it hasn't been seeded. Cached (`about`). */
export const getAbout = unstable_cache(
  async (): Promise<AboutContent | null> => {
    const [row] = await db.select().from(schema.about).limit(1);
    if (!row) return null;
    return {
      eyebrow: row.eyebrow,
      name: row.name,
      role: row.role,
      location: row.location,
      photo: { src: row.photoUrl, alt: row.photoAlt },
      paragraphs: row.paragraphs,
      education: {
        label: row.eduLabel,
        institution: row.eduInstitution,
        logo: { src: row.eduLogoUrl, alt: row.eduLogoAlt },
        degree: row.eduDegree,
        years: row.eduYears,
      },
    };
  },
  ["about"],
  { tags: [CACHE_TAGS.about] },
);
