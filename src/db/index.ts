import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Neon's free-tier compute scales to zero and cold-starts on demand, so the
// first HTTP query while it wakes can throw "fetch failed" (a connection that
// never established). Retry those transient network throws with exponential
// backoff — long enough to ride out a multi-second wake-up (~6s total) — so a
// cold start doesn't surface as a 500. Only *thrown* fetches are retried: a
// failed connection means the query never ran, so this is safe for writes too
// (an HTTP error from the server returns a Response and is not retried).
const MAX_DB_ATTEMPTS = 5;
neonConfig.fetchFunction = async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_DB_ATTEMPTS; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err) {
      lastError = err;
      if (attempt < MAX_DB_ATTEMPTS - 1) {
        const delay = Math.min(3000, 400 * 2 ** attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

const sql = neon(process.env.DATABASE_URL);

// Single Drizzle client over Neon's HTTP driver, shared across the app.
export const db = drizzle(sql, { schema });

export { schema };
