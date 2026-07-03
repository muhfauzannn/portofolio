"use client";

import * as React from "react";
import {
  ImagePlus,
  Loader2,
  Minus,
  Pencil,
  Plus,
  RotateCw,
  Trash2,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  addCanvasDoodle,
  addCanvasPhoto,
  deleteCanvasDoodle,
  deleteCanvasPhoto,
  updateCanvasPhoto,
} from "@/features/canvas/lib/actions";
import type { CanvasDoodle, CanvasPhoto } from "@/features/canvas/lib/queries";

const MIN_SCALE = 0.2;
const MAX_SCALE = 4;
const CENTER_TEXT =
  "this not my photography portofolio, it just me and my memories";

// Freehand pen palette (brand tokens as hex, stored per stroke).
const DRAW_COLORS = ["#1a1a1a", "#6544ff", "#84ff44"];
const DRAW_WIDTH = 4;

// Image picker accepts everything the browser calls an image, plus HEIC/HEIF
// (iPhone) explicitly — those are transcoded to JPEG server-side on upload.
const IMAGE_ACCEPT = "image/*,.heic,.heif";

type Transform = { x: number; y: number; scale: number };
type Point = { x: number; y: number };
type Draft = { points: Point[]; color: string; strokeWidth: number };

// Active pointer gesture.
type Interaction =
  | { type: "pan"; sx: number; sy: number; ox: number; oy: number }
  | { type: "drag"; id: string; sx: number; sy: number; px: number; py: number }
  | { type: "resize"; id: string; sx: number; pw: number }
  | {
      type: "rotate";
      id: string;
      cx: number;
      cy: number;
      a0: number;
      pr: number;
    }
  | { type: "draw" };

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const toPath = (pts: Point[]) =>
  pts.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");

/**
 * Infinite, Figma-style gallery canvas. Everyone can pan (drag) and zoom
 * (wheel / buttons). When `editable`, photos can be dragged, resized, rotated,
 * added and deleted, and the admin can scribble freehand doodles — each change
 * persisted through the canvas server actions.
 */
export function CanvasBoard({
  photos: initialPhotos,
  doodles: initialDoodles,
  editable,
}: {
  photos: CanvasPhoto[];
  doodles: CanvasDoodle[];
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

  const [photos, setPhotosState] = React.useState<CanvasPhoto[]>(initialPhotos);
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

  const [doodles, setDoodlesState] =
    React.useState<CanvasDoodle[]>(initialDoodles);
  const doodlesRef = React.useRef(doodles);
  const setDoodles = React.useCallback(
    (updater: (prev: CanvasDoodle[]) => CanvasDoodle[]) =>
      setDoodlesState((prev) => {
        const next = updater(prev);
        doodlesRef.current = next;
        return next;
      }),
    [],
  );

  const [draft, setDraftState] = React.useState<Draft | null>(null);
  const draftRef = React.useRef(draft);
  const setDraft = React.useCallback((d: Draft | null) => {
    draftRef.current = d;
    setDraftState(d);
  }, []);

  const [selected, setSelected] = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  // Temp ids of photos shown optimistically while their upload is in flight.
  const [uploadingIds, setUploadingIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [drawMode, setDrawMode] = React.useState(false);
  const [drawColor, setDrawColor] = React.useState(DRAW_COLORS[0]);
  const [dragOver, setDragOver] = React.useState(false);

  const interaction = React.useRef<Interaction | null>(null);
  // Active touch pointers (id → client coords) + the in-progress pinch, used to
  // drive two-finger pinch-zoom on mobile.
  const pointers = React.useRef<Map<number, Point>>(new Map());
  const pinch = React.useRef<{ dist: number; mid: Point } | null>(null);

  // Screen (client) coords → canvas coords, using the live transform.
  const screenToCanvas = React.useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      const t = transformRef.current;
      const left = rect?.left ?? 0;
      const top = rect?.top ?? 0;
      return {
        x: (clientX - left - t.x) / t.scale,
        y: (clientY - top - t.y) / t.scale,
      };
    },
    [],
  );

  // Center the canvas origin (0,0) on screen once we can measure the viewport.
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setTransform({ x: rect.width / 2, y: rect.height / 2, scale: 1 });
    setReady(true);
  }, [setTransform]);

  // Zoom toward an anchor point (container-relative), keeping the point fixed.
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

  // Wheel zoom — non-passive so we can preventDefault.
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

  // Persist a finished stroke, showing it optimistically under a temp id.
  const commitDoodle = React.useCallback(
    (d: Draft) => {
      const tempId = `temp-${Date.now()}`;
      setDoodles((prev) => [
        ...prev,
        { id: tempId, ...d, position: prev.length },
      ]);
      void addCanvasDoodle(d)
        .then((saved) =>
          setDoodles((prev) => prev.map((x) => (x.id === tempId ? saved : x))),
        )
        .catch(() => {
          setDoodles((prev) => prev.filter((x) => x.id !== tempId));
          toast.error("Couldn't save scribble");
        });
    },
    [setDoodles],
  );

  // Global move/up so a gesture keeps tracking even off the pressed element.
  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // Keep tracked pointers current; a live two-finger pinch overrides
      // everything else (pan/draw), zooming toward the fingers' midpoint.
      if (pointers.current.has(e.pointerId))
        pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch.current && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const rect = containerRef.current?.getBoundingClientRect();
        const midX = (a.x + b.x) / 2 - (rect?.left ?? 0);
        const midY = (a.y + b.y) / 2 - (rect?.top ?? 0);
        const prev = pinch.current;
        const t = transformRef.current;
        if (prev.dist > 0) {
          const scale = clamp(t.scale * (dist / prev.dist), MIN_SCALE, MAX_SCALE);
          const k = scale / t.scale;
          // Anchor the midpoint while scaling, then follow its drift (two-finger pan).
          setTransform({
            x: midX - (midX - t.x) * k + (midX - prev.mid.x),
            y: midY - (midY - t.y) * k + (midY - prev.mid.y),
            scale,
          });
        }
        pinch.current = { dist, mid: { x: midX, y: midY } };
        return;
      }
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
      } else if (it.type === "rotate") {
        const angle = Math.atan2(e.clientY - it.cy, e.clientX - it.cx);
        updatePhoto(it.id, {
          rotation: it.pr + ((angle - it.a0) * 180) / Math.PI,
        });
      } else if (it.type === "draw") {
        const pt = screenToCanvas(e.clientX, e.clientY);
        const d = draftRef.current;
        if (d) setDraft({ ...d, points: [...d.points, pt] });
      }
    };
    const onUp = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId);
      // A pinch needs two fingers; when one lifts, end it (the remaining finger
      // stays idle until re-pressed, avoiding a jump back into panning).
      if (pointers.current.size < 2) pinch.current = null;
      const it = interaction.current;
      interaction.current = null;
      if (!it) return;
      if (it.type === "drag" || it.type === "resize" || it.type === "rotate") {
        const p = photosRef.current.find((x) => x.id === it.id);
        if (p) {
          void updateCanvasPhoto(p.id, {
            x: Math.round(p.x),
            y: Math.round(p.y),
            width: Math.round(p.width),
            rotation: Math.round(p.rotation),
          }).catch(() => toast.error("Couldn't save placement"));
        }
      } else if (it.type === "draw") {
        const d = draftRef.current;
        setDraft(null);
        if (d && d.points.length > 1) commitDoodle(d);
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [setTransform, updatePhoto, screenToCanvas, setDraft, commitDoodle]);

  // Surface press → draw a stroke (draw mode) or pan (otherwise).
  const onSurfacePointerDown = (e: React.PointerEvent) => {
    // Track this pointer; a second finger on the surface starts a pinch-zoom,
    // superseding any pan/draw already begun by the first.
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2) {
      interaction.current = null;
      if (draftRef.current) setDraft(null);
      const [a, b] = [...pointers.current.values()];
      const rect = containerRef.current?.getBoundingClientRect();
      pinch.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        mid: {
          x: (a.x + b.x) / 2 - (rect?.left ?? 0),
          y: (a.y + b.y) / 2 - (rect?.top ?? 0),
        },
      };
      return;
    }
    if (editable && drawMode) {
      const pt = screenToCanvas(e.clientX, e.clientY);
      interaction.current = { type: "draw" };
      setDraft({ points: [pt], color: drawColor, strokeWidth: DRAW_WIDTH });
      return;
    }
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

  // Optimistic upload: paint a local preview at the drop point immediately,
  // then swap in the saved record (same x/y/rotation, real R2 url) once the
  // upload finishes. On failure the preview is removed.
  const uploadAt = async (file: File, pos: Point) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const objectUrl = URL.createObjectURL(file);
    const x = Math.round(pos.x);
    const y = Math.round(pos.y);
    const rotation = Math.round((Math.random() - 0.5) * 16);
    const temp: CanvasPhoto = {
      id: tempId,
      imageUrl: objectUrl,
      alt: "",
      x,
      y,
      width: 240,
      rotation,
      position: photosRef.current.length,
    };
    setPhotos((prev) => [...prev, temp]);
    setUploadingIds((prev) => new Set(prev).add(tempId));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("x", String(x));
      fd.append("y", String(y));
      fd.append("rotation", String(rotation));
      const saved = await addCanvasPhoto(fd);
      // Preserve any edits the admin made to the preview while it uploaded.
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === tempId
            ? { ...saved, x: p.x, y: p.y, width: p.width, rotation: p.rotation }
            : p,
        ),
      );
    } catch (err) {
      setPhotos((prev) => prev.filter((p) => p.id !== tempId));
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      URL.revokeObjectURL(objectUrl);
      setUploadingIds((prev) => {
        const next = new Set(prev);
        next.delete(tempId);
        return next;
      });
    }
  };

  const isImageFile = (f: File) =>
    f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name);

  // Drag-and-drop image files straight onto the canvas — each lands where it's
  // dropped (converted to canvas coords). Admin-only.
  const onDragOver = (e: React.DragEvent) => {
    if (!editable) return;
    if (!Array.from(e.dataTransfer.types).includes("Files")) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!dragOver) setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    // Ignore leaves into descendant elements; only clear when truly leaving.
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    if (!editable) return;
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(isImageFile);
    if (files.length === 0) return;
    const base = screenToCanvas(e.clientX, e.clientY);
    // Cascade multiple files slightly so they don't stack exactly.
    files.forEach(
      (file, i) =>
        void uploadAt(file, { x: base.x + i * 28, y: base.y + i * 28 }),
    );
  };

  async function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
    try {
      await deleteCanvasPhoto(id);
    } catch {
      toast.error("Delete failed");
    }
  }

  async function undoDoodle() {
    const last = doodlesRef.current[doodlesRef.current.length - 1];
    if (!last) return;
    setDoodles((prev) => prev.slice(0, -1));
    if (last.id.startsWith("temp-")) return; // not persisted yet
    try {
      await deleteCanvasDoodle(last.id);
    } catch {
      toast.error("Undo failed");
    }
  }

  // Begin rotating a photo around its on-screen center.
  const startRotate = (e: React.PointerEvent, p: CanvasPhoto) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    const t = transformRef.current;
    const cx = (rect?.left ?? 0) + t.x + p.x * t.scale;
    const cy = (rect?.top ?? 0) + t.y + p.y * t.scale;
    interaction.current = {
      type: "rotate",
      id: p.id,
      cx,
      cy,
      a0: Math.atan2(e.clientY - cy, e.clientX - cx),
      pr: p.rotation,
    };
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onSurfacePointerDown}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        "fixed inset-0 touch-none overflow-hidden bg-background select-none",
        editable && drawMode
          ? "[cursor:crosshair]"
          : "[cursor:grab] active:[cursor:grabbing]",
      )}
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
          <p className="font-heading text-4xl leading-tight font-normal text-balance text-brand-charcoal sm:text-6xl">
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
                editable && !drawMode
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
                editable &&
                  !drawMode &&
                  "[cursor:grab] active:[cursor:grabbing]",
                drawMode && "pointer-events-none",
                isSelected && "outline-2 outline-brand-purple",
              )}
              style={{
                left: p.x,
                top: p.y,
                width: p.width,
                transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                zIndex: isSelected ? 1000 : 10 + i,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.imageUrl}
                alt={p.alt}
                draggable={false}
                className="pointer-events-none block w-full object-cover"
              />

              {uploadingIds.has(p.id) ? (
                <div className="pointer-events-none absolute inset-2.5 bottom-8 grid place-items-center bg-brand-cream/40 backdrop-blur-[1px]">
                  <Loader2 className="size-6 animate-spin text-brand-charcoal" />
                </div>
              ) : null}

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

                  {/* Rotate handle (top-center). */}
                  <button
                    type="button"
                    aria-label="Rotate photo"
                    onPointerDown={(e) => startRotate(e, p)}
                    className="absolute -top-9 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full border-2 border-brand-purple bg-brand-cream text-brand-purple shadow-lg [cursor:grab] active:[cursor:grabbing]"
                  >
                    <RotateCw className="size-3.5" />
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

        {/* Doodle layer — scribbles paint above photos. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: -8000,
            top: -8000,
            width: 16000,
            height: 16000,
            zIndex: 500,
          }}
          viewBox="-8000 -8000 16000 16000"
        >
          {doodles.map((d) => (
            <path
              key={d.id}
              d={toPath(d.points)}
              fill="none"
              stroke={d.color}
              strokeWidth={d.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {draft ? (
            <path
              d={toPath(draft.points)}
              fill="none"
              stroke={draft.color}
              strokeWidth={draft.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
        </svg>
      </div>

      {/* Drag-and-drop hint — shown while dragging image files over the board. */}
      {editable && dragOver ? (
        <div className="pointer-events-none absolute inset-3 z-50 grid place-items-center rounded-2xl border-2 border-dashed border-brand-purple bg-brand-purple/5">
          <p className="rounded-full bg-brand-charcoal px-4 py-2 text-sm font-medium text-brand-cream">
            Drop image to add it here
          </p>
        </div>
      ) : null}

      {/* Empty-state hint for admins. */}
      {editable && photos.length === 0 && doodles.length === 0 ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-28 text-center text-sm text-muted-foreground">
          Add a photo or scribble to start your board.
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
        <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept={IMAGE_ACCEPT}
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

          <Button
            type="button"
            size="pill"
            variant={drawMode ? "default" : "outline"}
            onClick={() => {
              setDrawMode((v) => !v);
              setSelected(null);
            }}
          >
            <Pencil className="size-4" />
            {drawMode ? "Drawing" : "Draw"}
          </Button>

          {drawMode ? (
            <div className="flex items-center gap-1 rounded-full border border-border bg-card/90 p-1 shadow-lg backdrop-blur">
              {DRAW_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Pen color ${c}`}
                  onClick={() => setDrawColor(c)}
                  style={{ backgroundColor: c }}
                  className={cn(
                    "size-6 rounded-full ring-2 transition",
                    drawColor === c ? "ring-brand-purple" : "ring-transparent",
                  )}
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Undo last scribble"
                onClick={undoDoodle}
              >
                <Undo2 className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
