"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/features/admin/components/field";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { StringList } from "@/features/admin/components/string-list";
import { saveAbout, type AboutInput } from "@/features/admin/lib/actions";
import type { AboutRow } from "@/features/admin/lib/data";

export function AboutEditor({ about }: { about: AboutRow | null }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);
  const [state, setState] = React.useState<AboutInput>({
    id: about?.id,
    eyebrow: about?.eyebrow ?? "About me",
    name: about?.name ?? "",
    role: about?.role ?? "",
    location: about?.location ?? "",
    photoUrl: about?.photoUrl ?? "",
    photoAlt: about?.photoAlt ?? "",
    paragraphs: about?.paragraphs ?? [""],
    eduLabel: about?.eduLabel ?? "",
    eduInstitution: about?.eduInstitution ?? "",
    eduLogoUrl: about?.eduLogoUrl ?? "",
    eduLogoAlt: about?.eduLogoAlt ?? "",
    eduDegree: about?.eduDegree ?? "",
    eduYears: about?.eduYears ?? "",
  });

  const set = <K extends keyof AboutInput>(key: K, value: AboutInput[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function save() {
    setBusy(true);
    try {
      await saveAbout(state);
      toast.success("About saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <Field label="Eyebrow">
        <Input value={state.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Name">
          <Input value={state.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Role">
          <Input value={state.role} onChange={(e) => set("role", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={state.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
      </div>

      <Field label="Photo" hint="Alt text below.">
        <ImageUpload
          label="Photo"
          prefix="about"
          value={state.photoUrl}
          onChange={(url) => set("photoUrl", url)}
        />
      </Field>
      <Field label="Photo alt text">
        <Input value={state.photoAlt} onChange={(e) => set("photoAlt", e.target.value)} />
      </Field>

      <Field label="Description paragraphs">
        <StringList
          items={state.paragraphs}
          onChange={(v) => set("paragraphs", v)}
          multiline
          addLabel="Add paragraph"
        />
      </Field>

      <div className="rounded-2xl border border-border p-4">
        <p className="mb-3 font-heading text-lg">Education</p>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label" hint='e.g. "Currently studying at"'>
              <Input value={state.eduLabel} onChange={(e) => set("eduLabel", e.target.value)} />
            </Field>
            <Field label="Institution">
              <Input value={state.eduInstitution} onChange={(e) => set("eduInstitution", e.target.value)} />
            </Field>
            <Field label="Degree">
              <Input value={state.eduDegree} onChange={(e) => set("eduDegree", e.target.value)} />
            </Field>
            <Field label="Years">
              <Input value={state.eduYears} onChange={(e) => set("eduYears", e.target.value)} />
            </Field>
          </div>
          <Field label="Institution logo">
            <ImageUpload
              label="Logo"
              prefix="about/education"
              value={state.eduLogoUrl}
              onChange={(url) => set("eduLogoUrl", url)}
            />
          </Field>
          <Field label="Logo alt text">
            <Input value={state.eduLogoAlt} onChange={(e) => set("eduLogoAlt", e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <Button type="button" onClick={save} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save about
        </Button>
      </div>
    </div>
  );
}
