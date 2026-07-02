import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { type Skill } from "@/features/skills/data/skills";

/** All skills/tools, ordered. Cached under the `skills` tag. */
export const getSkills = unstable_cache(
  async (): Promise<Skill[]> => {
    const rows = await db
      .select()
      .from(schema.skill)
      .orderBy(asc(schema.skill.position));
    return rows.map((row) => ({ name: row.name, logoUrl: row.logoUrl }));
  },
  ["skills-all"],
  { tags: [CACHE_TAGS.skills] },
);
