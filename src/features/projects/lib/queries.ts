import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { type Project } from "@/features/projects/data/projects";

type ProjectRow = typeof schema.project.$inferSelect;

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    overview: row.overview,
    year: row.year,
    type: row.type,
    href: row.href,
    repo: row.repo ?? undefined,
    image: row.imageUrl || undefined,
    techStack: row.techStack,
    contributors: row.contributors,
    impact: row.impact,
    learnings: row.learnings,
    images: row.images,
  };
}

/** All projects, ordered for the carousel. Cached under the `projects` tag. */
export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const rows = await db
      .select()
      .from(schema.project)
      .orderBy(asc(schema.project.position));
    return rows.map(toProject);
  },
  ["projects-all"],
  { tags: [CACHE_TAGS.projects] },
);

/** A single project by slug, or null. Cached under the `projects` tag. */
export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<Project | null> => {
    const [row] = await db
      .select()
      .from(schema.project)
      .where(eq(schema.project.slug, slug))
      .limit(1);
    return row ? toProject(row) : null;
  },
  ["project-by-slug"],
  { tags: [CACHE_TAGS.projects] },
);

/** Slugs for `generateStaticParams`. */
export async function getProjectSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: schema.project.slug })
    .from(schema.project);
  return rows.map((r) => r.slug);
}
