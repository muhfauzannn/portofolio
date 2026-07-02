/**
 * Seed script — run with `npm run db:seed` (tsx loads .env.local).
 *
 *  1. Creates the single admin user from ADMIN_EMAIL / ADMIN_PASSWORD.
 *     Uses a signup-enabled Better Auth instance so the password is hashed
 *     exactly the way the login flow expects. Idempotent: skips if the user
 *     already exists.
 *  2. Seeds initial CMS content mirroring the current static site, but only
 *     when a table is empty (won't clobber edits on re-run).
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";

import { db, schema } from "../src/db";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  const existing = await db
    .select({ id: schema.user.id })
    .from(schema.user)
    .where(eq(schema.user.email, email))
    .limit(1);
  if (existing.length > 0) {
    console.log(`✓ admin already exists (${email})`);
    return;
  }

  // Signup-enabled instance, used only to create the admin with correct hashing.
  const seedAuth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: { enabled: true, disableSignUp: false },
    secret: process.env.BETTER_AUTH_SECRET,
  });

  await seedAuth.api.signUpEmail({
    body: { email, password, name: "Admin" },
  });
  console.log(`✓ created admin (${email})`);
}

async function isEmpty(table: (typeof schema)[keyof typeof schema]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await db.select().from(table as any).limit(1);
  return rows.length === 0;
}

async function seedContent() {
  // Hero socials
  if (await isEmpty(schema.heroSocial)) {
    await db.insert(schema.heroSocial).values([
      { label: "GitHub", url: "https://github.com/muhfauzannn", position: 0 },
      { label: "LinkedIn", url: "#", position: 1 },
      { label: "Instagram", url: "#", position: 2 },
    ]);
    console.log("✓ seeded hero socials");
  }

  // Hero photos (existing files in /public)
  if (await isEmpty(schema.heroPhoto)) {
    await db.insert(schema.heroPhoto).values([
      { imageUrl: "/fauzan.webp", alt: "Portrait one", caption: "It's me", position: 0 },
      { imageUrl: "/jakun.webp", alt: "Portrait two", caption: "Yellow jacket🤔", position: 1 },
      { imageUrl: "/webdev.JPG", alt: "Portrait three", caption: "Ristek fams", position: 2 },
    ]);
    console.log("✓ seeded hero photos");
  }

  // About (singleton)
  if (await isEmpty(schema.about)) {
    await db.insert(schema.about).values({
      eyebrow: "About me",
      name: "Muhammad Fauzan",
      role: "Software Engineer",
      location: "Indonesia",
      photoUrl: "/me.svg",
      photoAlt: "Portrait of Muhammad Fauzan",
      paragraphs: [
        "Hi, I'm Muhammad Fauzan, a developer who loves turning ideas into fast, polished, and playful web experiences. I care about the details: motion that feels right, layouts that breathe, and code that stays clean.",
        "I work mostly across the modern web stack, blending strong frontend craft with a solid understanding of what happens behind the scenes. When I'm not shipping, I'm usually exploring new tools, animations, and design ideas.",
      ],
      eduLabel: "Currently studying at",
      eduInstitution: "Universitas Indonesia",
      eduLogoUrl: "/logo-ui.webp",
      eduLogoAlt: "Logo of Universitas Indonesia",
      eduDegree: "Bachelor of Computer Science",
      eduYears: "2024 - 2028 (expected)",
    });
    console.log("✓ seeded about");
  }

  // Experience
  if (await isEmpty(schema.experienceItem)) {
    await db.insert(schema.experienceItem).values([
      {
        institution: "Universitas Indonesia",
        logoUrl: "/logo-ui.webp",
        logoAlt: "Logo of Universitas Indonesia",
        position: 0,
        roles: [
          {
            period: "2024 — Present",
            role: "Software Engineer",
            description:
              "Building and maintaining internal web platforms — shipping clean, accessible interfaces while keeping the codebase modular and fast.",
          },
          {
            period: "2023 — 2024",
            role: "Frontend Developer Intern",
            description:
              "Implemented UI components and page flows from design handoffs, and helped establish the team's reusable component conventions.",
          },
        ],
      },
      {
        institution: "Freelance",
        logoUrl: "",
        logoAlt: "Freelance",
        position: 1,
        roles: [
          {
            period: "2023 — 2024",
            role: "Web Developer",
            description:
              "Delivered end-to-end websites for small businesses, from design handoff to deployment, with a focus on polished motion and responsive layouts.",
          },
        ],
      },
      {
        institution: "Open Source",
        logoUrl: "",
        logoAlt: "Open Source",
        position: 2,
        roles: [
          {
            period: "2022 — 2023",
            role: "DevOps Engineer",
            description:
              "Automated build and deployment pipelines, containerized services, and improved developer workflows across a handful of community projects.",
          },
        ],
      },
    ]);
    console.log("✓ seeded experience");
  }

  // Projects
  if (await isEmpty(schema.project)) {
    await db.insert(schema.project).values([
      {
        slug: "sentr",
        name: "Sentr",
        tagline: "Lightweight error tracking for indie teams.",
        overview:
          "Sentr captures exceptions from web and server runtimes, groups them into issues, and surfaces the ones that actually matter. Built to give small teams the essentials of a full observability suite without the price tag or the noise.",
        year: "2025",
        type: "Web app",
        href: "#",
        repo: "#",
        position: 0,
        techStack: [
          { name: "Next.js", logoUrl: "" },
          { name: "tRPC", logoUrl: "" },
          { name: "PostgreSQL", logoUrl: "" },
        ],
        contributors: [
          { name: "Aditya Rahman", role: "Backend", href: "#" },
          { name: "Sarah Lin", role: "Design", href: "#" },
        ],
        impact: [
          "Cut mean time to detection from hours to under a minute for the pilot team.",
          "Grouped 40k+ raw events into ~200 actionable issues per week.",
          "Shipped a type-safe SDK adopted across three internal services.",
        ],
        learnings: [
          "Designing an ingestion pipeline that stays cheap under bursty traffic.",
          "Modelling error fingerprints so unrelated stack traces never collide.",
          "Keeping a tRPC API ergonomic as the surface area grew.",
        ],
        images: [],
      },
      {
        slug: "loopmail",
        name: "Loopmail",
        tagline: "A calmer inbox built around threads, not messages.",
        overview:
          "Loopmail reimagines email as a stream of conversations. It batches low-priority mail, collapses noisy threads, and gives you a single keyboard-driven surface to triage everything in one pass.",
        year: "2024",
        type: "Web app",
        href: "#",
        repo: "#",
        position: 1,
        techStack: [
          { name: "React", logoUrl: "" },
          { name: "Node.js", logoUrl: "" },
          { name: "Tailwind CSS", logoUrl: "" },
        ],
        contributors: [{ name: "Devin Park", role: "Frontend", href: "#" }],
        impact: [
          "Reduced average triage time by ~35% in a 20-person beta.",
          "Handled 1M+ synced messages without a full re-index.",
          "Reached a fully keyboard-navigable inbox with zero mouse required.",
        ],
        learnings: [
          "Building an offline-first sync layer with optimistic updates.",
          "Virtualising very long thread lists without dropping frames.",
          "Balancing real-time delivery against battery and bandwidth.",
        ],
        images: [],
      },
    ]);
    console.log("✓ seeded projects");
  }

  // Skills (logos uploaded later via the CMS)
  if (await isEmpty(schema.skill)) {
    const names = [
      "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS",
      "HTML5", "Node.js", "NestJS", "Hono", "Go", "C", "Python",
      "Java", "Docker", "Flutter", "GSAP", "Framer Motion", "Git", "Figma",
    ];
    await db
      .insert(schema.skill)
      .values(names.map((name, position) => ({ name, logoUrl: "", position })));
    console.log("✓ seeded skills");
  }
}

async function main() {
  await seedAdmin();
  await seedContent();
  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
