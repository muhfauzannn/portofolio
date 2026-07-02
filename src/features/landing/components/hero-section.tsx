"use client";

import * as React from "react";
// import type { CSSProperties } from "react";
import Image from "next/image";
import { Download, ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/motion/reveal";
import TextType from "@/components/motion/TextType";
import {
  // SHOWCASE,
  type ShowcaseItem,
} from "@/features/landing/data/landing";
import {
  type HeroPhoto,
  type HeroSocial,
} from "@/features/landing/lib/queries";

/** Per-card resting tilt so the pile looks hand-scattered. */
const PHOTO_TILT = [-6, 5, -3, 7, -4];

/** Resume file — drop the PDF in /public and update the path if needed. */
const RESUME_HREF = "/resume.pdf";

/** Screen tint per showcase tone — tokens only, no raw values. */
const TONE: Record<ShowcaseItem["tone"], string> = {
  charcoal: "bg-brand-charcoal text-brand-cream",
  cream: "bg-brand-cream text-brand-charcoal",
  purple: "bg-brand-purple text-brand-purple-foreground",
  lime: "bg-brand-lime text-brand-lime-foreground",
};

export function HeroSection({
  photos,
  socials,
}: {
  photos: HeroPhoto[];
  socials: HeroSocial[];
}) {
  return (
    <section className="relative overflow-hidden px-4 flex min-h-screen flex-col justify-center">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-10 text-center lg:grid-cols-[1.4fr_1fr] lg:gap-12 lg:text-left">
        <div>
          <Reveal delay={60} className="flex flex-col gap-0">
            <p className="font-script text-brand-purple text-4xl max-md:text-2xl">
              Hi, I&apos;m{" "}
            </p>
            <h1
              id="hero-name"
              className="font-heading text-brand-charcoal text-4xl font-normal whitespace-nowrap sm:text-7xl"
            >
              Muhammad Fauzan
            </h1>
            <TextType
              as="p"
              className="mt-3 font-heading text-2xl text-foreground sm:text-3xl"
              text={[
                "a Software Engineer",
                "a Web Developer",
                "a DevOps Engineer",
              ]}
              typingSpeed={70}
              deletingSpeed={40}
              pauseDuration={1800}
              cursorClassName="text-brand-purple"
            />
            <p className="mx-auto font-heading mt-6 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg lg:mx-0">
              This is my portfolio, where I transform caffeine and late-night
              debugging into actual, working solutions. Take a look around, and
              don't hesitate to reach out.
            </p>

            {/* Social links + resume */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              {socials.map(({ label, url, iconUrl }) => (
                <Button
                  key={label}
                  asChild
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt=""
                        aria-hidden
                        width={16}
                        height={16}
                        className="size-4 object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {label.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </a>
                </Button>
              ))}

              <Button asChild size="pill">
                <a href={RESUME_HREF} target="_blank" rel="noopener noreferrer">
                  <Download className="size-4" />
                  Resume
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Stacked printed photos — click to shuffle through them */}
        <Reveal delay={180}>
          <PhotoStack photos={photos} />
        </Reveal>
      </div>

      {/* Infinite reel of tilted showcase screens (§2C) */}
      {/* <Reveal delay={220}>
        <div className="relative mt-16">
          <Marquee
            pauseOnHover
            style={{ "--gap": "2.5rem" } as CSSProperties}
            className="py-8 [--duration:38s]"
          >
            {SHOWCASE.map((item) => (
              <ShowcaseScreen key={item.title} item={item} />
            ))}
          </Marquee>
        </div>
      </Reveal> */}
    </section>
  );
}

function PhotoStack({ photos }: { photos: HeroPhoto[] }) {
  // `order[last]` is the front photo.
  const [order, setOrder] = React.useState(() => photos.map((_, i) => i));
  const [drag, setDrag] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);
  const start = React.useRef({ x: 0, y: 0 });

  const sendToBack = React.useCallback(() => {
    setOrder((prev) => {
      const next = [...prev];
      const front = next.pop();
      return front === undefined ? prev : [front, ...next];
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    start.current = { x: e.clientX, y: e.clientY };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false); // re-enable the transition first…
    const { x, y } = drag;
    const dist = Math.hypot(x, y);

    if (dist < 6) {
      // Plain tap → just advance.
      setDrag({ x: 0, y: 0 });
      sendToBack();
      return;
    }

    if (dist > 90) {
      // Fling the card out along the drag direction, then cycle it to the back.
      const k = 640 / dist;
      setLeaving(true);
      requestAnimationFrame(() => setDrag({ x: x * k, y: y * k }));
      window.setTimeout(() => {
        sendToBack();
        setDrag({ x: 0, y: 0 });
        setLeaving(false);
      }, 300);
      return;
    }

    // …then animate the snap-back on the next frame so the transition runs.
    requestAnimationFrame(() => setDrag({ x: 0, y: 0 }));
  };

  return (
    <div className="relative mx-auto aspect-4/5 w-56 select-none sm:w-64">
      {order.map((cardIndex, stackPos) => {
        const photo = photos[cardIndex];
        const depth = order.length - 1 - stackPos; // 0 = front
        const isFront = depth === 0;
        const dragTf =
          isFront && (dragging || drag.x !== 0 || drag.y !== 0)
            ? ` translate(${drag.x}px, ${drag.y}px) rotate(${drag.x * 0.05}deg)`
            : "";
        return (
          <button
            key={cardIndex}
            type="button"
            tabIndex={isFront ? 0 : -1}
            aria-label={
              isFront
                ? "Drag or tap to shuffle photos"
                : `Photo: ${photo.caption}`
            }
            onKeyDown={(e) => {
              if (isFront && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                sendToBack();
              }
            }}
            onPointerDown={isFront ? onPointerDown : undefined}
            onPointerMove={isFront ? onPointerMove : undefined}
            onPointerUp={isFront ? onPointerUp : undefined}
            // Resolve the drag even if the pointer is released outside the window.
            onPointerCancel={isFront ? onPointerUp : undefined}
            onLostPointerCapture={isFront ? onPointerUp : undefined}
            style={{
              zIndex: stackPos,
              opacity: isFront && leaving ? 0 : 1,
              // Peek via offset only (no scale) so promoting a card doesn't "grow".
              transform: `translate(${depth * 7}px, ${depth * -9}px) rotate(${
                PHOTO_TILT[cardIndex % PHOTO_TILT.length]
              }deg)${dragTf}`,
            }}
            className={cn(
              "absolute inset-0 touch-none rounded-sm bg-brand-cream p-3 pb-10 text-left shadow-2xl shadow-foreground/20 ring-1 ring-foreground/10",
              isFront ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
              dragging && isFront
                ? "transition-none"
                : "transition-[transform,opacity] duration-300 ease-out",
            )}
          >
            {/*
              Swap the placeholder for your photo by setting `src` in PHOTOS.
              Files live in /public, e.g. src: "/me.jpg".
            */}
            <div className="pointer-events-none relative h-full overflow-hidden bg-brand-charcoal/5">
              {photo.src ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  draggable={false}
                  sizes="16rem"
                  className="object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center bg-linear-to-b from-muted to-accent">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="size-9" />
                    <span className="text-xs font-medium">Your photo</span>
                  </div>
                </div>
              )}
            </div>
            <span className="absolute inset-x-0 bottom-2 text-center font-heading text-lg text-brand-charcoal">
              {photo.caption}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function ShowcaseScreen({ item }: { item: ShowcaseItem }) {
  return (
    <figure
      style={{ rotate: item.tilt }}
      className="group w-64 shrink-0 transition-[transform,rotate] duration-300 hover:rotate-0 hover:-translate-y-1 sm:w-72"
    >
      {/* Laptop-style bezel around the screen */}
      <div className="rounded-2xl bg-brand-charcoal p-2 shadow-2xl shadow-foreground/20 ring-1 ring-foreground/10">
        <div
          className={cn(
            "grid aspect-[16/10] place-items-center overflow-hidden rounded-lg",
            TONE[item.tone],
          )}
        >
          <item.icon className="size-10 opacity-90 transition-transform duration-300 group-hover:scale-110" />
        </div>
      </div>
      <figcaption className="mt-3 px-1 text-sm font-medium text-muted-foreground">
        {item.title}
      </figcaption>
    </figure>
  );
}
