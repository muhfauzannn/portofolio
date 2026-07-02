"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/features/admin/components/field";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await signIn.email({ email, password });
      if (error) {
        toast.error(error.message ?? "Invalid credentials");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="py-8">
          <h1 className="mb-6 text-center font-heading text-2xl">Admin login</h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field label="Email">
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" disabled={busy} className="mt-2">
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
