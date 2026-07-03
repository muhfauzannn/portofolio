import { SiteNav } from "@/components/layout/site-nav";
import { CanvasBoard } from "@/features/canvas/components/canvas-board";
import {
  getCanvasDoodles,
  getCanvasPhotos,
  type CanvasDoodle,
  type CanvasPhoto,
} from "@/features/canvas/lib/queries";

/**
 * Canvas ("Gallery") feature — a full-screen, pannable/zoomable board of
 * photos and scribbles. Server Component: reads the (cached) content and hands
 * it to the client board. `editable` unlocks admin drag/rotate/draw/add/delete.
 */
export async function CanvasPage({ editable }: { editable: boolean }) {
  // Load each independently so a DB hiccup (or an unmigrated doodle table)
  // doesn't blank the rest — the centerpiece statement + grid always render.
  const [photosResult, doodlesResult] = await Promise.allSettled([
    getCanvasPhotos(),
    getCanvasDoodles(),
  ]);
  const photos: CanvasPhoto[] =
    photosResult.status === "fulfilled" ? photosResult.value : [];
  const doodles: CanvasDoodle[] =
    doodlesResult.status === "fulfilled" ? doodlesResult.value : [];
  if (photosResult.status === "rejected")
    console.error("Canvas: failed to load photos", photosResult.reason);
  if (doodlesResult.status === "rejected")
    console.error("Canvas: failed to load doodles", doodlesResult.reason);

  return (
    <div className="relative">
      <SiteNav />
      <CanvasBoard photos={photos} doodles={doodles} editable={editable} />
    </div>
  );
}
