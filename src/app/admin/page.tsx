import { redirect } from "next/navigation";

import { AdminPage } from "@/features/admin";
import { getSession } from "@/features/admin/lib/session";

// Route entry for the CMS. Server-validates the session (middleware only does
// an optimistic cookie check) and delegates to the feature.
export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return <AdminPage />;
}
