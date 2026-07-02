"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/features/admin/components/field";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { StringList } from "@/features/admin/components/string-list";
import {
  deleteProject,
  saveProject,
  type ProjectInput,
} from "@/features/admin/lib/actions";
import type { ProjectRow } from "@/features/admin/lib/data";

function fromRow(row: ProjectRow): ProjectInput {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    overview: row.overview,
    year: row.year,
    type: row.type,
    href: row.href,
    repo: row.repo ?? "",
    imageUrl: row.imageUrl,
    techStack: row.techStack,
    contributors: row.contributors,
    impact: row.impact,
    learnings: row.learnings,
    images: row.images,
    position: row.position,
  };
}

const BLANK: ProjectInput = {
  slug: "",
  name: "",
  tagline: "",
  overview: "",
  year: "",
  type: "",
  href: "",
  repo: "",
  imageUrl: "",
  techStack: [],
  contributors: [],
  impact: [],
  learnings: [],
  images: [],
  position: 0,
};

export function ProjectsEditor({ projects }: { projects: ProjectRow[] }) {
  const [drafts, setDrafts] = React.useState<ProjectInput[]>([]);

  return (
    <div className="flex flex-col gap-4">
      {projects.map((row) => (
        <ProjectCard key={row.id} initial={fromRow(row)} />
      ))}
      {drafts.map((draft, i) => (
        <ProjectCard
          key={`draft-${i}`}
          initial={{ ...draft, position: projects.length + i }}
          defaultOpen
          onSaved={() => setDrafts((d) => d.filter((_, j) => j !== i))}
        />
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDrafts((d) => [...d, { ...BLANK }])}
        >
          <Plus className="size-4" />
          Add project
        </Button>
      </div>
    </div>
  );
}

function ProjectCard({
  initial,
  defaultOpen = false,
  onSaved,
}: {
  initial: ProjectInput;
  defaultOpen?: boolean;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(defaultOpen);
  const [state, setState] = React.useState<ProjectInput>(initial);
  const [busy, setBusy] = React.useState(false);

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  async function save() {
    if (!state.slug.trim() || !state.name.trim()) {
      toast.error("Slug and name are required");
      return;
    }
    setBusy(true);
    try {
      await saveProject(state);
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
      await deleteProject(state.id);
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
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex-1 text-left font-heading text-lg"
            onClick={() => setOpen((o) => !o)}
          >
            {state.name || "Untitled project"}
            <span className="ml-2 text-sm text-muted-foreground">
              /{state.slug || "slug"}
            </span>
          </button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={remove}
            disabled={busy}
            aria-label="Delete project"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {open ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <Input value={state.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <Field label="Slug" hint="URL segment: /projects/<slug>">
                <Input value={state.slug} onChange={(e) => set("slug", e.target.value)} />
              </Field>
              <Field label="Year">
                <Input value={state.year} onChange={(e) => set("year", e.target.value)} />
              </Field>
              <Field label="Type" hint='e.g. "Web app"'>
                <Input value={state.type} onChange={(e) => set("type", e.target.value)} />
              </Field>
              <Field label="Live URL">
                <Input value={state.href} onChange={(e) => set("href", e.target.value)} />
              </Field>
              <Field label="Repo URL" hint="Optional">
                <Input value={state.repo} onChange={(e) => set("repo", e.target.value)} />
              </Field>
            </div>

            <Field label="Tagline">
              <Input value={state.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>
            <Field label="Overview">
              <Textarea
                value={state.overview}
                rows={4}
                onChange={(e) => set("overview", e.target.value)}
              />
            </Field>

            <Field label="Cover image">
              <ImageUpload
                label="Cover"
                prefix="projects/cover"
                value={state.imageUrl}
                onChange={(url) => set("imageUrl", url)}
              />
            </Field>

            {/* Tech stack */}
            <div className="rounded-xl border border-border p-3">
              <p className="mb-2 text-sm font-medium">Tech stack</p>
              <div className="flex flex-col gap-2">
                {state.techStack.map((tech, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <Field label="Name" className="flex-1">
                      <Input
                        value={tech.name}
                        onChange={(e) =>
                          set(
                            "techStack",
                            patchAt(state.techStack, i, { name: e.target.value }),
                          )
                        }
                      />
                    </Field>
                    <ImageUpload
                      label="Logo"
                      prefix="projects/tech"
                      value={tech.logoUrl}
                      onChange={(logoUrl) =>
                        set("techStack", patchAt(state.techStack, i, { logoUrl }))
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove tech"
                      onClick={() => set("techStack", removeAt(state.techStack, i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      set("techStack", [...state.techStack, { name: "", logoUrl: "" }])
                    }
                  >
                    <Plus className="size-4" />
                    Add tech
                  </Button>
                </div>
              </div>
            </div>

            {/* Contributors */}
            <div className="rounded-xl border border-border p-3">
              <p className="mb-2 text-sm font-medium">Contributors</p>
              <div className="flex flex-col gap-2">
                {state.contributors.map((person, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <Field label="Name" className="flex-1">
                      <Input
                        value={person.name}
                        onChange={(e) =>
                          set(
                            "contributors",
                            patchAt(state.contributors, i, { name: e.target.value }),
                          )
                        }
                      />
                    </Field>
                    <Field label="Role" className="flex-1">
                      <Input
                        value={person.role}
                        onChange={(e) =>
                          set(
                            "contributors",
                            patchAt(state.contributors, i, { role: e.target.value }),
                          )
                        }
                      />
                    </Field>
                    <Field label="Link" className="flex-1">
                      <Input
                        value={person.href ?? ""}
                        onChange={(e) =>
                          set(
                            "contributors",
                            patchAt(state.contributors, i, { href: e.target.value }),
                          )
                        }
                      />
                    </Field>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove contributor"
                      onClick={() =>
                        set("contributors", removeAt(state.contributors, i))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      set("contributors", [
                        ...state.contributors,
                        { name: "", role: "", href: "" },
                      ])
                    }
                  >
                    <Plus className="size-4" />
                    Add contributor
                  </Button>
                </div>
              </div>
            </div>

            <Field label="Impact">
              <StringList
                items={state.impact}
                onChange={(v) => set("impact", v)}
                multiline
                addLabel="Add impact point"
              />
            </Field>
            <Field label="What I learned">
              <StringList
                items={state.learnings}
                onChange={(v) => set("learnings", v)}
                multiline
                addLabel="Add learning"
              />
            </Field>

            {/* Gallery */}
            <div className="rounded-xl border border-border p-3">
              <p className="mb-2 text-sm font-medium">Gallery images</p>
              <div className="flex flex-col gap-2">
                {state.images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ImageUpload
                      label="Image"
                      prefix="projects/gallery"
                      value={url}
                      onChange={(newUrl) =>
                        set(
                          "images",
                          state.images.map((u, j) => (j === i ? newUrl : u)),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove image"
                      onClick={() => set("images", removeAt(state.images, i))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => set("images", [...state.images, ""])}
                  >
                    <Plus className="size-4" />
                    Add image
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Button type="button" onClick={save} disabled={busy}>
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Save project
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function patchAt<T>(arr: T[], index: number, patch: Partial<T>): T[] {
  return arr.map((item, i) => (i === index ? { ...item, ...patch } : item));
}
function removeAt<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}
