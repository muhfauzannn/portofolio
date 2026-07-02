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
import {
  deleteHeroPhoto,
  deleteHeroSocial,
  saveHeroPhoto,
  saveHeroSocial,
  saveSiteSetting,
} from "@/features/admin/lib/actions";
import type {
  HeroPhotoRow,
  HeroSocialRow,
  SiteSettingRow,
} from "@/features/admin/lib/data";

export function HeroEditor({
  socials,
  photos,
  siteSetting,
}: {
  socials: HeroSocialRow[];
  photos: HeroPhotoRow[];
  siteSetting: SiteSettingRow | null;
}) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h3 className="font-heading text-xl">Social links</h3>
        <p className="-mt-2 text-sm text-muted-foreground">
          GitHub, LinkedIn, and Instagram use built-in brand icons (matched by
          label) — no icon upload needed for those.
        </p>
        <SocialList socials={socials} />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-heading text-xl">Resume</h3>
        <ResumeForm siteSetting={siteSetting} />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="font-heading text-xl">Photos</h3>
        <PhotoList photos={photos} />
      </section>
    </div>
  );
}

// --- Resume link ------------------------------------------------------------

function ResumeForm({ siteSetting }: { siteSetting: SiteSettingRow | null }) {
  const router = useRouter();
  const [resumeUrl, setResumeUrl] = React.useState(
    siteSetting?.resumeUrl ?? "",
  );
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setBusy(true);
    try {
      await saveSiteSetting({ id: siteSetting?.id, resumeUrl });
      toast.success("Resume link saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-end">
        <Field
          label="Resume link"
          className="flex-1"
          hint="The URL the hero Resume button opens (e.g. /resume.pdf or a Google Drive link)."
        >
          <Input
            value={resumeUrl}
            placeholder="/resume.pdf"
            onChange={(e) => setResumeUrl(e.target.value)}
          />
        </Field>
        <Button type="button" size="sm" onClick={save} disabled={busy}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save
        </Button>
      </CardContent>
    </Card>
  );
}

// --- Socials ----------------------------------------------------------------

type SocialDraft = {
  id?: string;
  label: string;
  url: string;
  iconUrl: string;
  position: number;
};

function SocialList({ socials }: { socials: HeroSocialRow[] }) {
  const [drafts, setDrafts] = React.useState<SocialDraft[]>([]);

  return (
    <div className="flex flex-col gap-3">
      {socials.map((row) => (
        <SocialRow key={row.id} initial={row} />
      ))}
      {drafts.map((draft, i) => (
        <SocialRow
          key={`draft-${i}`}
          initial={{ ...draft, position: socials.length + i }}
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
              { label: "", url: "", iconUrl: "", position: 0 },
            ])
          }
        >
          <Plus className="size-4" />
          Add social link
        </Button>
      </div>
    </div>
  );
}

function SocialRow({
  initial,
  onSaved,
}: {
  initial: SocialDraft;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [state, setState] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setBusy(true);
    try {
      await saveHeroSocial(state);
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
      await deleteHeroSocial(state.id);
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
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-end">
        <Field label="Label" className="sm:w-40">
          <Input
            value={state.label}
            onChange={(e) => setState({ ...state, label: e.target.value })}
          />
        </Field>
        <Field label="URL" className="flex-1">
          <Input
            value={state.url}
            onChange={(e) => setState({ ...state, url: e.target.value })}
          />
        </Field>
        <ImageUpload
          label="Icon"
          prefix="hero/socials"
          value={state.iconUrl}
          onChange={(iconUrl) => setState({ ...state, iconUrl })}
        />
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

// --- Photos -----------------------------------------------------------------

type PhotoDraft = {
  id?: string;
  imageUrl: string;
  alt: string;
  caption: string;
  position: number;
};

function PhotoList({ photos }: { photos: HeroPhotoRow[] }) {
  const [drafts, setDrafts] = React.useState<PhotoDraft[]>([]);

  return (
    <div className="flex flex-col gap-3">
      {photos.map((row) => (
        <PhotoRow key={row.id} initial={row} />
      ))}
      {drafts.map((draft, i) => (
        <PhotoRow
          key={`draft-${i}`}
          initial={{ ...draft, position: photos.length + i }}
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
              { imageUrl: "", alt: "", caption: "", position: 0 },
            ])
          }
        >
          <Plus className="size-4" />
          Add photo
        </Button>
      </div>
    </div>
  );
}

function PhotoRow({
  initial,
  onSaved,
}: {
  initial: PhotoDraft;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [state, setState] = React.useState(initial);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setBusy(true);
    try {
      await saveHeroPhoto(state);
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
      await deleteHeroPhoto(state.id);
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
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-end">
        <ImageUpload
          label="Photo"
          prefix="hero/photos"
          value={state.imageUrl}
          onChange={(imageUrl) => setState({ ...state, imageUrl })}
        />
        <Field label="Alt text" className="flex-1">
          <Input
            value={state.alt}
            onChange={(e) => setState({ ...state, alt: e.target.value })}
          />
        </Field>
        <Field label="Caption" className="flex-1">
          <Input
            value={state.caption}
            onChange={(e) => setState({ ...state, caption: e.target.value })}
          />
        </Field>
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
