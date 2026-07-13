"use client";

import * as React from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { TransitionLink } from "@/components/motion/transition-link";
import { type Project } from "@/features/projects/data/projects";

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * Projects — a 3D coverflow carousel. The focused project sits centred and
 * upright with a lime frame + footer (name, stack, link); the rest fan out to
 * the sides, tilted and dimmed. Drag/swipe left-right, use the arrows/dots, or
 * click a side card to bring it to the centre. Client leaf; `projects` is
 * supplied by the server component.
 */
export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const [active, setActive] = React.useState(0);
  // Fractional slide offset applied live while dragging.
  const [drag, setDrag] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const pointer = React.useRef<{ id: number; startX: number } | null>(null);
  const moved = React.useRef(false);

  // Wrap an index into [0, count) so the carousel loops seamlessly.
  const wrap = React.useCallback(
    (n: number) => ((n % count) + count) % count,
    [count],
  );

  const go = React.useCallback(
    (dir: number) => setActive((a) => wrap(a + dir)),
    [wrap],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    pointer.current = { id: e.pointerId, startX: e.clientX };
    moved.current = false;
    // Note: we deliberately do NOT capture the pointer yet. Capturing on a plain
    // tap swallows the follow-up `click`, which would stop the footer link (and
    // side cards) from navigating. We only capture once a real drag begins.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointer.current || pointer.current.id !== e.pointerId) return;
    const width = stageRef.current?.offsetWidth ?? 1;
    const dx = e.clientX - pointer.current.startX;
    // First time the pointer crosses the threshold, promote it to a drag and
    // capture so tracking survives the pointer leaving the stage.
    if (!moved.current && Math.abs(dx) > 5) {
      moved.current = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (!moved.current) return;
    // Roughly one card-width of travel per slide.
    setDrag(clamp((dx / width) * 1.6, -1.2, 1.2));
  };

  const endDrag = () => {
    if (!pointer.current) return;
    // Dragging right (drag > 0) reveals the previous project.
    setActive((a) => wrap(Math.round(a - drag)));
    setDrag(0);
    setDragging(false);
    pointer.current = null;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  // Circular offset from the centre for each card, wrapped into (-count/2,
  // count/2] so both sides always stay balanced.
  const positions = projects.map((_, i) => {
    let pos = wrap(i - active + drag);
    if (pos > count / 2) pos -= count;
    return pos;
  });

  // Settled offset (no drag) — used to spot the wrap-around jump on a step.
  const settledPos = React.useCallback(
    (a: number, i: number) => {
      let pos = wrap(i - a);
      if (pos > count / 2) pos -= count;
      return pos;
    },
    [wrap, count],
  );

  // When a card wraps to the far side on a step, suppress its transform tween
  // for one frame so it reappears there instead of flying across the stage.
  const prevActive = React.useRef(active);
  const [noAnim, setNoAnim] = React.useState<number[]>([]);
  React.useEffect(() => {
    const from = prevActive.current;
    prevActive.current = active;
    if (from === active) return;
    const wrapped = projects
      .map((_, i) => i)
      .filter(
        (i) =>
          Math.abs(settledPos(active, i) - settledPos(from, i)) > count / 2,
      );
    if (wrapped.length) setNoAnim(wrapped);
  }, [active, projects, settledPos, count]);
  React.useEffect(() => {
    if (!noAnim.length) return;
    const id = requestAnimationFrame(() => setNoAnim([]));
    return () => cancelAnimationFrame(id);
  }, [noAnim]);

  return (
    <div className="select-none">
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Projects"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        className="relative mx-auto h-[clamp(380px,64vw,620px)] max-w-6xl cursor-grab touch-pan-y outline-none active:cursor-grabbing"
      >
        {projects.map((project, i) => {
          const pos = positions[i];
          const abs = Math.abs(pos);
          const hidden = abs > 2.4;
          const isCenter = wrap(Math.round(active - drag)) === i;

          const translateX = pos * 20; // % of the card's own width
          // Flat 2D fan: left cards lean left, right cards lean right.
          const rotate = clamp(pos * 4, -10, 10);
          const scale = clamp(1 - abs * 0.14, 0.62, 1);

          // While dragging, or when a card wraps to the far side, skip the
          // transform tween so it tracks the finger / reappears instantly.
          const noTween = dragging || noAnim.includes(i);

          return (
            <article
              key={project.name}
              aria-hidden={!isCenter}
              onClick={() => {
                if (!moved.current && i !== active) setActive(i);
              }}
              style={{
                transform: `translate(-50%, -50%) translateX(${translateX}%) rotate(${rotate}deg) scale(${scale})`,
                zIndex: 100 - Math.round(abs * 10),
                opacity: hidden ? 0 : clamp(1 - (abs - 1) * 0.5, 0.25, 1),
                pointerEvents: hidden ? "none" : undefined,
                transition: noTween ? "none" : undefined,
              }}
              className={cn(
                "absolute top-1/2 left-1/2 w-[clamp(300px,84vw,720px)] will-change-transform",
                "transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                !isCenter && "cursor-pointer",
              )}
            >
              <ProjectCard project={project} active={isCenter} />
            </article>
          );
        })}
      </div>

      {/* Controls — arrows + progress dots. */}
      {/* <div className="mt-8 flex items-center justify-center gap-5">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => go(-1)}
          aria-label="Previous project"
        >
          <ChevronLeft />
        </Button>

        <div className="flex items-center gap-2">
          {projects.map((project, i) => (
            <button
              key={project.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to ${project.name}`}
              aria-current={i === active}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === active ? "w-6 bg-brand-purple" : "w-2 bg-border",
              )}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => go(1)}
          aria-label="Next project"
        >
          <ChevronRight />
        </Button>
      </div> */}
    </div>
  );
}

function ProjectCard({
  project,
  active,
}: {
  project: Project;
  active: boolean;
}) {
  return (
    <div className="relative">
      {/* Image — its own rounded card. The lime frame is always 6px (so the
          size never jumps); only its colour + radius animate, in sync with the
          footer below, so the whole frame appears as one. */}
      <div
        className={cn(
          "overflow-hidden border-x-6 border-t-6 bg-brand-charcoal shadow-2xl shadow-black/30 transition-[border-color,border-radius] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active
            ? "rounded-t-lg border-brand-lime"
            : "rounded-lg border-white/10",
        )}
      >
        <ProjectVisual project={project} />
      </div>

      {/* Footer — a separate lime bar below the image (only on the focused
          card). Positioned absolutely so it never changes the card's height,
          keeping the image put; its height + opacity animate open/closed. */}
      <div
        className={cn(
          "absolute inset-x-0 top-full grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "flex items-center justify-between gap-2 rounded-b-lg bg-brand-lime px-5 py-2 text-brand-lime-foreground transition-opacity duration-300",
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="min-w-0">
              <p className="truncate font-heading text-lg font-normal tracking-tight sm:text-xl">
                {project.name}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium tracking-wide text-brand-lime-foreground/70">
                {project.techStack.map((t) => t.name).join(" · ")}
              </p>
            </div>
            <Button
              asChild
              variant="charcoal"
              size="icon"
              className="rounded-full"
              tabIndex={active ? 0 : -1}
            >
              <TransitionLink
                href={`/projects/${project.slug}`}
                aria-label={`View ${project.name}`}
              >
                <ArrowUpRight />
              </TransitionLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className="relative aspect-16/10 w-full overflow-hidden bg-brand-charcoal">
      {project.image ? (
        <Image
          src={project.image}
          alt={project.name}
          fill
          draggable={false}
          sizes="(max-width: 768px) 72vw, 540px"
        />
      ) : (
        <div className="flex size-full flex-col justify-between bg-linear-to-br from-brand-purple/40 via-brand-charcoal to-brand-charcoal p-5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-brand-cream/20" />
            <span className="size-2.5 rounded-full bg-brand-cream/20" />
            <span className="size-2.5 rounded-full bg-brand-cream/20" />
            <span className="ml-2 font-mono text-[0.65rem] tracking-widest text-brand-cream/50 uppercase">
              {`// ${project.name}`}
            </span>
          </div>
          <div>
            <p className="font-heading text-3xl font-bold tracking-tight text-brand-cream sm:text-4xl">
              {project.name}
            </p>
            <p className="mt-2 font-mono text-xs text-brand-cream/50">
              {project.techStack.map((t) => t.name).join("  •  ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
