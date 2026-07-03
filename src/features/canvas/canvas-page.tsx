import { SiteNav } from "@/components/layout/site-nav";
import { CanvasBoard } from "@/features/canvas/components/canvas-board";
import {
  getCanvasPhotos,
  type CanvasPhoto,
} from "@/features/canvas/lib/queries";

/**
 * Canvas ("Gallery") feature — a full-screen, pannable/zoomable board of
 * photos. Server Component: reads the (cached) photos and hands them to the
 * client board. `editable` unlocks admin drag/add/delete on the live canvas.
 */
export async function CanvasPage({ editable }: { editable: boolean }) {
  // A DB hiccup shouldn't blank the whole gallery — fall back to an empty
  // board so the centerpiece statement + grid still render.
  let photos: CanvasPhoto[] = [];
  try {
    photos = await getCanvasPhotos();
  } catch (err) {
    console.error("Canvas: failed to load photos", err);
  }

  return (
    <div className="relative">
      <SiteNav />
      <CanvasBoard photos={photos} editable={editable} />
    </div>
  );
}
