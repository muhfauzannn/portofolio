import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/features/admin";
import { getSession } from "@/features/admin/lib/session";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

// Already logged in → straight to the dashboard.
export default async function Page() {
  const session = await getSession();
  if (session) redirect("/admin");
  return <LoginForm />;
}
