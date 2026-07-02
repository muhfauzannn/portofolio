import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Guards the admin area. This is an optimistic check — it only verifies a
 * session cookie exists so it can run on the edge without a DB call. The real
 * session validation still happens in the admin server components / actions
 * (via `auth.api.getSession`).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page must stay reachable while logged out.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
