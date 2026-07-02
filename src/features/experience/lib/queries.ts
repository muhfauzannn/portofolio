import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { type ExperienceItem } from "@/features/experience/data/experience";

/** Experience institutions (with nested roles), ordered. Cached (`experience`). */
export const getExperience = unstable_cache(
  async (): Promise<ExperienceItem[]> => {
    const rows = await db
      .select()
      .from(schema.experienceItem)
      .orderBy(asc(schema.experienceItem.position));
    return rows.map((row) => ({
      institution: row.institution,
      logo: { src: row.logoUrl, alt: row.logoAlt },
      roles: row.roles,
    }));
  },
  ["experience-all"],
  { tags: [CACHE_TAGS.experience] },
);
