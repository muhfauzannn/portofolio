"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/features/admin/components/field";
import { ImageUpload } from "@/features/admin/components/image-upload";
import {
  deleteExperience,
  reorderExperience,
  saveExperience,
  type ExperienceInput,
} from "@/features/admin/lib/actions";
import type { ExperienceRow } from "@/features/admin/lib/data";
import type { ExperienceRoleJson } from "@/db/schema";

export function ExperienceEditor({ items }: { items: ExperienceRow[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = React.useState<ExperienceInput[]>([]);
  // Local copy of the saved rows so reordering feels instant; kept in sync
  // with the server rows whenever they change (after a refresh).
  const [order, setOrder] = React.useState<ExperienceRow[]>(items);
  const [reordering, setReordering] = React.useState(false);
  React.useEffect(() => setOrder(items), [items]);

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
    setReordering(true);
    try {
      await reorderExperience(next.map((row) => row.id));
      router.refresh();
    } catch (err) {
      setOrder(order); // revert on failure
      toast.error(err instanceof Error ? err.message : "Reorder failed");
    } finally {
      setReordering(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Order top-to-bottom sets priority — the item at the top shows first on
        the site.
      </p>
      {order.map((row, i) => (
        <ExperienceItemCard
          key={row.id}
          initial={row}
          onMoveUp={i > 0 ? () => move(i, -1) : undefined}
          onMoveDown={i < order.length - 1 ? () => move(i, 1) : undefined}
          reordering={reordering}
        />
      ))}
      {drafts.map((draft, i) => (
        <ExperienceItemCard
          key={`draft-${i}`}
          initial={{ ...draft, position: order.length + i }}
          onSaved={() => setDrafts((d) => d.filter((_, j) => j !== i))}
        />
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setDrafts((d) => [
              ...d,
              {
                institution: "",
                logoUrl: "",
                logoAlt: "",
                roles: [{ period: "", role: "", description: "" }],
                position: 0,
              },
            ])
          }
        >
          <Plus className="size-4" />
          Add experience
        </Button>
      </div>
    </div>
  );
}

function ExperienceItemCard({
  initial,
  onSaved,
  onMoveUp,
  onMoveDown,
  reordering,
}: {
  initial: ExperienceInput;
  onSaved?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  reordering?: boolean;
}) {
  const router = useRouter();
  const [state, setState] = React.useState<ExperienceInput>(initial);
  const [busy, setBusy] = React.useState(false);

  function setRole(i: number, patch: Partial<ExperienceRoleJson>) {
    setState((s) => ({
      ...s,
      roles: s.roles.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    }));
  }

  async function save() {
    setBusy(true);
    try {
      await saveExperience(state);
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
      await deleteExperience(state.id);
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
      <CardContent className="flex flex-col gap-4 py-5">
        {(onMoveUp || onMoveDown) && (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-sm font-medium text-muted-foreground">
              {state.institution || "Untitled"}
            </span>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={onMoveUp}
                disabled={!onMoveUp || reordering}
                aria-label="Move up"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-8"
                onClick={onMoveDown}
                disabled={!onMoveDown || reordering}
                aria-label="Move down"
              >
                <ArrowDown className="size-4" />
              </Button>
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Institution">
            <Input
              value={state.institution}
              onChange={(e) => setState({ ...state, institution: e.target.value })}
            />
          </Field>
          <Field label="Logo alt text">
            <Input
              value={state.logoAlt}
              onChange={(e) => setState({ ...state, logoAlt: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Logo">
          <ImageUpload
            label="Logo"
            prefix="experience"
            value={state.logoUrl}
            onChange={(logoUrl) => setState({ ...state, logoUrl })}
          />
        </Field>

        <div className="flex flex-col gap-3 rounded-xl border border-border p-3">
          <p className="text-sm font-medium">Roles (most recent first)</p>
          {state.roles.map((role, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg bg-muted/40 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label="Role">
                  <Input
                    value={role.role}
                    onChange={(e) => setRole(i, { role: e.target.value })}
                  />
                </Field>
                <Field label="Period" hint='e.g. "2024 — Present"'>
                  <Input
                    value={role.period}
                    onChange={(e) => setRole(i, { period: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Description">
                <Textarea
                  value={role.description}
                  rows={2}
                  onChange={(e) => setRole(i, { description: e.target.value })}
                />
              </Field>
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      roles: s.roles.filter((_, j) => j !== i),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                  Remove role
                </Button>
              </div>
            </div>
          ))}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setState((s) => ({
                  ...s,
                  roles: [...s.roles, { period: "", role: "", description: "" }],
                }))
              }
            >
              <Plus className="size-4" />
              Add role
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
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
            size="sm"
            onClick={remove}
            disabled={busy}
          >
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
