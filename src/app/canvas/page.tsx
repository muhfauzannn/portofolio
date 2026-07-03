import type { Metadata } from "next";

import { CanvasPage } from "@/features/canvas";
import { getSession } from "@/features/admin/lib/session";

export const metadata: Metadata = {
  title: "Gallery",
};

// Route entry — resolves the session so admins get an editable canvas, then
// delegates to the feature. Visitors just pan/zoom. A failed session lookup
// (e.g. a transient DB error) degrades to a read-only canvas rather than 500.
export default async function Page() {
  let editable = false;
  try {
    editable = !!(await getSession());
  } catch (err) {
    console.error("Canvas: session check failed", err);
  }
  return <CanvasPage editable={editable} />;
}
