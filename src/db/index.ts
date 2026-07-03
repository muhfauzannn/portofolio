import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Neon's free-tier compute scales to zero and cold-starts on demand, so the
// first HTTP query while it wakes can throw "fetch failed" (a connection that
// never established). Retry those transient network throws with a short backoff
// so a wake-up blip doesn't surface as a 500. Only *thrown* fetches are retried
// — a failed connection means the query never ran, so this is safe for writes
// too (an HTTP error from the server returns a Response and is not retried).
neonConfig.fetchFunction = async (
  input: RequestInfo | URL,
  init?: RequestInit,
) => {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err) {
      lastError = err;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  throw lastError;
};

const sql = neon(process.env.DATABASE_URL);

// Single Drizzle client over Neon's HTTP driver, shared across the app.
export const db = drizzle(sql, { schema });

export { schema };
