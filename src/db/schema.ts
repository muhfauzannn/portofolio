import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Database schema (Drizzle + Postgres/Neon).
 *
 * Two groups of tables:
 *  1. Better Auth tables (user/session/account/verification) — column shapes
 *     must match what the Better Auth Drizzle adapter expects.
 *  2. CMS content tables — one per editable landing section. Top-level editable
 *     entities are rows; nested repeatable sub-items (roles, tech, contributors,
 *     bullet lists, galleries) live in jsonb to keep forms + mutations simple.
 */

// ---------------------------------------------------------------------------
// Better Auth
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// CMS content
// ---------------------------------------------------------------------------

/** Hero social links (label + url + uploaded icon). */
export const heroSocial = pgTable("hero_social", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  url: text("url").notNull(),
  iconUrl: text("icon_url").notNull().default(""),
  position: integer("position").notNull().default(0),
});

/** Stacked hero photos. */
export const heroPhoto = pgTable("hero_photo", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  imageUrl: text("image_url").notNull().default(""),
  alt: text("alt").notNull().default(""),
  caption: text("caption").notNull().default(""),
  position: integer("position").notNull().default(0),
});

/** About section — a single row (singleton). */
export const about = pgTable("about", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  eyebrow: text("eyebrow").notNull().default(""),
  name: text("name").notNull().default(""),
  role: text("role").notNull().default(""),
  location: text("location").notNull().default(""),
  photoUrl: text("photo_url").notNull().default(""),
  photoAlt: text("photo_alt").notNull().default(""),
  paragraphs: jsonb("paragraphs").$type<string[]>().notNull().default([]),
  eduLabel: text("edu_label").notNull().default(""),
  eduInstitution: text("edu_institution").notNull().default(""),
  eduLogoUrl: text("edu_logo_url").notNull().default(""),
  eduLogoAlt: text("edu_logo_alt").notNull().default(""),
  eduDegree: text("edu_degree").notNull().default(""),
  eduYears: text("edu_years").notNull().default(""),
});

export type ExperienceRoleJson = {
  period: string;
  role: string;
  description: string;
};

/** One institution in the Experience timeline; roles nested as jsonb. */
export const experienceItem = pgTable("experience_item", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  institution: text("institution").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  logoAlt: text("logo_alt").notNull().default(""),
  roles: jsonb("roles").$type<ExperienceRoleJson[]>().notNull().default([]),
  position: integer("position").notNull().default(0),
});

export type TechJson = { name: string; logoUrl: string };
export type ContributorJson = { name: string; role: string; href?: string };

/** A project; nested repeatables (tech/contributors/bullets/gallery) as jsonb. */
export const project = pgTable("project", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  overview: text("overview").notNull().default(""),
  year: text("year").notNull().default(""),
  type: text("type").notNull().default(""),
  href: text("href").notNull().default(""),
  repo: text("repo"),
  imageUrl: text("image_url").notNull().default(""),
  techStack: jsonb("tech_stack").$type<TechJson[]>().notNull().default([]),
  contributors: jsonb("contributors")
    .$type<ContributorJson[]>()
    .notNull()
    .default([]),
  impact: jsonb("impact").$type<string[]>().notNull().default([]),
  learnings: jsonb("learnings").$type<string[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  position: integer("position").notNull().default(0),
});

/** A skill / tool (name + uploaded logo). */
export const skill = pgTable("skill", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull().default(""),
  position: integer("position").notNull().default(0),
});
