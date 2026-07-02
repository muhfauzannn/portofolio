// Types + static config for the Skills feature. The list of skills now lives in
// the database (read via `lib/queries.ts`); each skill has an uploaded logo.

// One skill = a label + its uploaded brand logo (R2). Empty `logoUrl` falls
// back to the skill's initials.
export type Skill = { name: string; logoUrl: string };

// GitHub username for the contributions calendar — change to yours.
export const GITHUB_USERNAME = "muhfauzannn";
