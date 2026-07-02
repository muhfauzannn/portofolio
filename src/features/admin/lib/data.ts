import { asc } from "drizzle-orm";

import { db, schema } from "@/db";

/**
 * Direct (uncached) reads for the admin UI, so edits are reflected immediately.
 * The public site uses the cached queries in each feature's `lib/queries.ts`.
 */

export function getHeroSocialsAdmin() {
  return db
    .select()
    .from(schema.heroSocial)
    .orderBy(asc(schema.heroSocial.position));
}

export function getHeroPhotosAdmin() {
  return db
    .select()
    .from(schema.heroPhoto)
    .orderBy(asc(schema.heroPhoto.position));
}

export async function getAboutAdmin() {
  const [row] = await db.select().from(schema.about).limit(1);
  return row ?? null;
}

export function getExperienceAdmin() {
  return db
    .select()
    .from(schema.experienceItem)
    .orderBy(asc(schema.experienceItem.position));
}

export function getProjectsAdmin() {
  return db
    .select()
    .from(schema.project)
    .orderBy(asc(schema.project.position));
}

export function getSkillsAdmin() {
  return db.select().from(schema.skill).orderBy(asc(schema.skill.position));
}

export type HeroSocialRow = typeof schema.heroSocial.$inferSelect;
export type HeroPhotoRow = typeof schema.heroPhoto.$inferSelect;
export type AboutRow = typeof schema.about.$inferSelect;
export type ExperienceRow = typeof schema.experienceItem.$inferSelect;
export type ProjectRow = typeof schema.project.$inferSelect;
export type SkillRow = typeof schema.skill.$inferSelect;
