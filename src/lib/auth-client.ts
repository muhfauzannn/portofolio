import { createAuthClient } from "better-auth/react";

// Client-side auth helpers for the admin login form.
export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
