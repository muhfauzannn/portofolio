"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/features/admin/components/field";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { deleteSkill, saveSkill } from "@/features/admin/lib/actions";
import type { SkillRow } from "@/features/admin/lib/data";

type SkillDraft = { id?: string; name: string; logoUrl: string; position: number };

export function SkillsEditor({ skills }: { skills: SkillRow[] }) {
  const [drafts, setDrafts] = React.useState<SkillDraft[]>([]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {skills.map((row) => (
          <SkillRow key={row.id} initial={row} />
        ))}
        {drafts.map((draft, i) => (
          <SkillRow
            key={`draft-${i}`}
            initial={{ ...draft, position: skills.length + i }}
            onSaved={() => setDrafts((d) => d.filter((_, j) => j !== i))}
          />
        ))}
      </div>
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setDrafts((d) => [...d, { name: "", logoUrl: "", position: 0 }])
          }
        >
          <Plus className="size-4" />
          Add skill
        </Button>
      </div>
    </div>
  );
}

function SkillRow({
  initial,
  onSaved,
}: {
  initial: SkillDraft;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [state, setState] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setBusy(true);
    try {
      await saveSkill(state);
      toast.success("Saved");
      onSaved?.();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!state.id) return onSaved?.();
    setBusy(true);
    try {
      await deleteSkill(state.id);
      toast.success("Deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex items-end gap-3 py-4">
        <Field label="Name" className="flex-1">
          <Input
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
          />
        </Field>
        <ImageUpload
          label="Logo"
          prefix="skills"
          value={state.logoUrl}
          onChange={(logoUrl) => setState({ ...state, logoUrl })}
        />
        <div className="flex gap-1">
          <Button type="button" size="sm" onClick={save} disabled={busy}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={remove}
            disabled={busy}
            aria-label="Delete"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
