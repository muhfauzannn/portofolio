"use server";

import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

import { db, schema } from "@/db";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { uploadToR2 } from "@/lib/r2";
import type {
  ContributorJson,
  ExperienceRoleJson,
  TechJson,
} from "@/db/schema";
import { requireSession } from "@/features/admin/lib/session";

// --- Upload -----------------------------------------------------------------

/** Uploads an image to R2 and returns its public URL. Admin-only. */
export async function uploadImage(formData: FormData): Promise<string> {
  await requireSession();
  const file = formData.get("file");
  const prefix = (formData.get("prefix") as string) || "misc";
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("No file provided");
  }
  return uploadToR2(file, prefix);
}

// --- Hero socials -----------------------------------------------------------

export type HeroSocialInput = {
  id?: string;
  label: string;
  url: string;
  iconUrl: string;
  position: number;
};

export async function saveHeroSocial(input: HeroSocialInput) {
  await requireSession();
  const { id, ...values } = input;
  if (id) {
    await db
      .update(schema.heroSocial)
      .set(values)
      .where(eq(schema.heroSocial.id, id));
  } else {
    await db.insert(schema.heroSocial).values(values);
  }
  revalidateTag(CACHE_TAGS.hero, "max");
}

export async function deleteHeroSocial(id: string) {
  await requireSession();
  await db.delete(schema.heroSocial).where(eq(schema.heroSocial.id, id));
  revalidateTag(CACHE_TAGS.hero, "max");
}

// --- Hero photos ------------------------------------------------------------

export type HeroPhotoInput = {
  id?: string;
  imageUrl: string;
  alt: string;
  caption: string;
  position: number;
};

export async function saveHeroPhoto(input: HeroPhotoInput) {
  await requireSession();
  const { id, ...values } = input;
  if (id) {
    await db
      .update(schema.heroPhoto)
      .set(values)
      .where(eq(schema.heroPhoto.id, id));
  } else {
    await db.insert(schema.heroPhoto).values(values);
  }
  revalidateTag(CACHE_TAGS.hero, "max");
}

export async function deleteHeroPhoto(id: string) {
  await requireSession();
  await db.delete(schema.heroPhoto).where(eq(schema.heroPhoto.id, id));
  revalidateTag(CACHE_TAGS.hero, "max");
}

// --- About ------------------------------------------------------------------

export type AboutInput = {
  id?: string;
  eyebrow: string;
  name: string;
  role: string;
  location: string;
  photoUrl: string;
  photoAlt: string;
  paragraphs: string[];
  eduLabel: string;
  eduInstitution: string;
  eduLogoUrl: string;
  eduLogoAlt: string;
  eduDegree: string;
  eduYears: string;
};

export async function saveAbout(input: AboutInput) {
  await requireSession();
  const { id, ...values } = input;
  if (id) {
    await db.update(schema.about).set(values).where(eq(schema.about.id, id));
  } else {
    await db.insert(schema.about).values(values);
  }
  revalidateTag(CACHE_TAGS.about, "max");
}

// --- Experience -------------------------------------------------------------

export type ExperienceInput = {
  id?: string;
  institution: string;
  logoUrl: string;
  logoAlt: string;
  roles: ExperienceRoleJson[];
  position: number;
};

export async function saveExperience(input: ExperienceInput) {
  await requireSession();
  const { id, ...values } = input;
  if (id) {
    await db
      .update(schema.experienceItem)
      .set(values)
      .where(eq(schema.experienceItem.id, id));
  } else {
    await db.insert(schema.experienceItem).values(values);
  }
  revalidateTag(CACHE_TAGS.experience, "max");
}

export async function deleteExperience(id: string) {
  await requireSession();
  await db.delete(schema.experienceItem).where(eq(schema.experienceItem.id, id));
  revalidateTag(CACHE_TAGS.experience, "max");
}

// --- Projects ---------------------------------------------------------------

export type ProjectInput = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  overview: string;
  year: string;
  type: string;
  href: string;
  repo: string;
  imageUrl: string;
  techStack: TechJson[];
  contributors: ContributorJson[];
  impact: string[];
  learnings: string[];
  images: string[];
  position: number;
};

export async function saveProject(input: ProjectInput) {
  await requireSession();
  const { id, ...values } = input;
  if (id) {
    await db.update(schema.project).set(values).where(eq(schema.project.id, id));
  } else {
    await db.insert(schema.project).values(values);
  }
  revalidateTag(CACHE_TAGS.projects, "max");
}

export async function deleteProject(id: string) {
  await requireSession();
  await db.delete(schema.project).where(eq(schema.project.id, id));
  revalidateTag(CACHE_TAGS.projects, "max");
}

// --- Skills -----------------------------------------------------------------

export type SkillInput = {
  id?: string;
  name: string;
  logoUrl: string;
  position: number;
};

export async function saveSkill(input: SkillInput) {
  await requireSession();
  const { id, ...values } = input;
  if (id) {
    await db.update(schema.skill).set(values).where(eq(schema.skill.id, id));
  } else {
    await db.insert(schema.skill).values(values);
  }
  revalidateTag(CACHE_TAGS.skills, "max");
}

export async function deleteSkill(id: string) {
  await requireSession();
  await db.delete(schema.skill).where(eq(schema.skill.id, id));
  revalidateTag(CACHE_TAGS.skills, "max");
}
