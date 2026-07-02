import { redirect } from "next/navigation";

import { LoginForm } from "@/features/admin";
import { getSession } from "@/features/admin/lib/session";

// Already logged in → straight to the dashboard.
export default async function Page() {
  const session = await getSession();
  if (session) redirect("/admin");
  return <LoginForm />;
}
