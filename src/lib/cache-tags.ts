/**
 * Cache tags for the public landing content. Public reads are wrapped in
 * `unstable_cache` with these tags; admin mutations call `revalidateTag(...)`
 * with the matching tag so edits appear immediately without per-request DB hits.
 */
export const CACHE_TAGS = {
  hero: "hero",
  about: "about",
  experience: "experience",
  projects: "projects",
  skills: "skills",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
