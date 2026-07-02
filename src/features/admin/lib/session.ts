import { headers } from "next/headers";

import { auth } from "@/lib/auth";

/**
 * Returns the current session or null. Real (DB-backed) validation — the
 * middleware only does an optimistic cookie check.
 */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Throws when there is no session — defense in depth for server actions. */
export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
