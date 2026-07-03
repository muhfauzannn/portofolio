"use client";

import * as React from "react";
import { ImagePlus, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  addCanvasPhoto,
  deleteCanvasPhoto,
  updateCanvasPhoto,
} from "@/features/canvas/lib/actions";
import type { CanvasPhoto } from "@/features/canvas/lib/queries";

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const CENTER_TEXT =
  "this is not my photographic portofolio, this just me and my memories";

type Transform = { x: number; y: number; scale: number };

// Active pointer gesture. `pan` moves the viewport; `drag`/`resize` edit a photo.
type Interaction =
  | { type: "pan"; sx: number; sy: number; ox: number; oy: number }
  | { type: "drag"; id: string; sx: number; sy: number; px: number; py: number }
  | { type: "resize"; id: string; sx: number; pw: number };

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * Infinite, Figma-style gallery canvas. Everyone can pan (drag) and zoom
 * (wheel / buttons). When `editable`, photos can be dragged, resized, added and
 * deleted, and each change is persisted through the canvas server actions.
 */
export function CanvasBoard({
  photos: initial,
  editable,
}: {
  photos: CanvasPhoto[];
  editable: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const [transform, setTransformState] = React.useState<Transform>({
    x: 0,
    y: 0,
    scale: 1,
  });
  const transformRef = React.useRef(transform);
  const setTransform = React.useCallback((t: Transform) => {
    transformRef.current = t;
    setTransformState(t);
  }, []);

  const [photos, setPhotosState] = React.useState<CanvasPhoto[]>(initial);
  const photosRef = React.useRef(photos);
  const setPhotos = React.useCallback(
    (updater: (prev: CanvasPhoto[]) => CanvasPhoto[]) =>
      setPhotosState((prev) => {
        const next = updater(prev);
        photosRef.current = next;
        return next;
      }),
    [],
  );
  const updatePhoto = React.useCallback(
    (id: string, patch: Partial<CanvasPhoto>) =>
      setPhotos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      ),
    [setPhotos],
  );

  const [selected, setSelected] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const interaction = React.useRef<Interaction | null>(null);

  // Center the canvas origin (0,0) on screen once we can measure the viewport.
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTransform({ x: rect.width / 2, y: rect.height / 2, scale: 1 });
    setReady(true);
  }, [setTransform]);

  // Zoom toward an anchor point (in container-relative coords), keeping the
  // canvas point under that anchor fixed.
  const zoomAt = React.useCallback(
    (anchorX: number, anchorY: number, factor: number) => {
      const t = transformRef.current;
      const scale = clamp(t.scale * factor, MIN_SCALE, MAX_SCALE);
      const k = scale / t.scale;
      setTransform({
        x: anchorX - (anchorX - t.x) * k,
        y: anchorY - (anchorY - t.y) * k,
        scale,
      });
    },
    [setTransform],
  );

  // Wheel zoom — needs a non-passive listener so we can preventDefault.
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(
        e.clientX - rect.left,
        e.clientY - rect.top,
        Math.exp(-e.deltaY * 0.0015),
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Global move/up so a gesture keeps tracking even off the pressed element.
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const it = interaction.current;
      if (!it) return;
      if (it.type === "pan") {
        setTransform({
          ...transformRef.current,
          x: it.ox + (e.clientX - it.sx),
          y: it.oy + (e.clientY - it.sy),
        });
      } else if (it.type === "drag") {
        const s = transformRef.current.scale;
        updatePhoto(it.id, {
          x: it.px + (e.clientX - it.sx) / s,
          y: it.py + (e.clientY - it.sy) / s,
        });
      } else if (it.type === "resize") {
        const s = transformRef.current.scale;
        updatePhoto(it.id, {
          width: clamp(it.pw + (e.clientX - it.sx) / s, 80, 900),
        });
      }
    };
    const onUp = () => {
      const it = interaction.current;
      interaction.current = null;
      if (it && (it.type === "drag" || it.type === "resize")) {
        const p = photosRef.current.find((x) => x.id === it.id);
        if (p) {
          void updateCanvasPhoto(p.id, {
            x: Math.round(p.x),
            y: Math.round(p.y),
            width: Math.round(p.width),
            rotation: Math.round(p.rotation),
          }).catch(() => toast.error("Couldn't save placement"));
        }
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setTransform, updatePhoto]);

  // Background press → start panning (and deselect).
  const onBackgroundPointerDown = (e: React.PointerEvent) => {
    const t = transformRef.current;
    interaction.current = {
      type: "pan",
      sx: e.clientX,
      sy: e.clientY,
      ox: t.x,
      oy: t.y,
    };
    setSelected(null);
  };

  const zoomByButton = (factor: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, factor);
  };

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const created = await addCanvasPhoto(fd);
      setPhotos((prev) => [...prev, created]);
      setSelected(created.id);
      toast.success("Photo added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
    try {
      await deleteCanvasPhoto(id);
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onBackgroundPointerDown}
      className="fixed inset-0 touch-none overflow-hidden bg-background select-none [cursor:grab] active:[cursor:grabbing]"
    >
      {/* World layer — everything inside lives in canvas space and scales/pans. */}
      <div
        className={cn(
          "absolute top-0 left-0 origin-top-left transition-opacity duration-300",
          ready ? "opacity-100" : "opacity-0",
        )}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      >
        {/* Dotted grid that pans/zooms with the world for a Figma-like feel. */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: -6000,
            top: -6000,
            width: 12000,
            height: 12000,
            backgroundImage:
              "radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Center statement, pinned at the canvas origin. */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ left: 0, top: 0, width: 620 }}
        >
          <p className="font-heading text-3xl leading-tight font-semibold text-balance text-brand-charcoal sm:text-4xl">
            {CENTER_TEXT}
          </p>
        </div>

        {photos.map((p, i) => {
          const isSelected = editable && selected === p.id;
          return (
            <div
              key={p.id}
              data-photo
              onPointerDown={
                editable
                  ? (e) => {
                      e.stopPropagation();
                      setSelected(p.id);
                      interaction.current = {
                        type: "drag",
                        id: p.id,
                        sx: e.clientX,
                        sy: e.clientY,
                        px: p.x,
                        py: p.y,
                      };
                    }
                  : undefined
              }
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-brand-cream p-2.5 pb-8 shadow-2xl shadow-foreground/25 ring-1 ring-foreground/10",
                editable && "[cursor:grab] active:[cursor:grabbing]",
                isSelected && "outline-2 outline-brand-purple",
              )}
              style={{
                left: p.x,
                top: p.y,
                width: p.width,
                transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                zIndex: isSelected ? 1000 : i,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.alt}
                draggable={false}
                className="pointer-events-none block w-full object-cover"
              />

              {isSelected ? (
                <>
                  <button
                    type="button"
                    aria-label="Delete photo"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => removePhoto(p.id)}
                    className="absolute -top-3 -right-3 grid size-7 place-items-center rounded-full bg-brand-charcoal text-brand-cream shadow-lg transition-colors hover:bg-brand-purple"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                  {/* Resize handle (bottom-right). */}
                  <span
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      interaction.current = {
                        type: "resize",
                        id: p.id,
                        sx: e.clientX,
                        pw: p.width,
                      };
                    }}
                    className="absolute -right-2 -bottom-2 size-5 rounded-full border-2 border-brand-purple bg-brand-cream [cursor:nwse-resize]"
                  />
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Empty-state hint for admins. */}
      {editable && photos.length === 0 ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-28 text-center text-sm text-muted-foreground">
          Add a photo to start your board.
        </p>
      ) : null}

      {/* Zoom controls (everyone). */}
      <div className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full border border-border bg-card/90 p-1 shadow-lg backdrop-blur">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Zoom out"
          onClick={() => zoomByButton(1 / 1.2)}
        >
          <Minus className="size-4" />
        </Button>
        <button
          type="button"
          onClick={() => zoomByButton(1 / transformRef.current.scale)}
          className="w-12 text-center text-xs font-medium tabular-nums text-muted-foreground"
        >
          {Math.round(transform.scale * 100)}%
        </button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Zoom in"
          onClick={() => zoomByButton(1.2)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      {/* Admin toolbar. */}
      {editable ? (
        <div className="absolute bottom-4 left-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <Button
            type="button"
            size="pill"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            Add photo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
