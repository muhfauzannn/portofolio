"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Asterisk } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Barba-style page transitions, native to the Next App Router.
 * A persistent overlay of brand-colored columns wipes up to cover the screen
 * (leave), the route changes underneath, then the columns wipe off the top
 * (enter). Colors follow DESIGN.md §4.
 */

type TransitionContext = { navigate: (href: string) => void };

const TransitionCtx = React.createContext<TransitionContext>({
  navigate: () => {},
});

export const usePageTransition = () => React.useContext(TransitionCtx);

// Staggered color bands — charcoal / purple / lime / cream (DESIGN.md palette).
const COLUMNS = [
  "bg-brand-charcoal",
  "bg-brand-charcoal",
  "bg-brand-charcoal",
  "bg-brand-charcoal",
  "bg-brand-charcoal",
  "bg-brand-charcoal",
  "bg-brand-charcoal",
];

const EASE = "power4.inOut";

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const colsRef = React.useRef<HTMLDivElement[]>([]);
  const asteriskRef = React.useRef<HTMLDivElement>(null);
  const animating = React.useRef(false);
  const pendingEnter = React.useRef(false);
  const failsafe = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  // Set the resting state once (client-only) via useGSAP for auto-cleanup.
  // This runs in a layout effect before paint, so the columns start hidden
  // below the fold without any CSS transform seeding gsap's cache.
  useGSAP(
    () => {
      gsap.set(colsRef.current, { yPercent: 100 });
      gsap.set(asteriskRef.current, { scale: 0, rotate: -90 });
    },
    { scope: overlayRef },
  );

  // ENTER — wipe the columns off the top to reveal the freshly-mounted route.
  const runEnter = React.useCallback(() => {
    if (failsafe.current) clearTimeout(failsafe.current);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlayRef.current, { pointerEvents: "none" });
        animating.current = false;
      },
    });
    tl.to(asteriskRef.current, {
      scale: 0,
      rotate: 90,
      duration: 0.3,
      ease: "power2.in",
    });
    tl.to(
      colsRef.current,
      { yPercent: -100, duration: 0.6, stagger: 0.07, ease: EASE },
      "-=0.1",
    );
  }, []);

  // Run ENTER only after a real navigation commits (pathname changed).
  React.useEffect(() => {
    if (!pendingEnter.current) return;
    pendingEnter.current = false;
    runEnter();
  }, [pathname, runEnter]);

  const navigate = React.useCallback(
    (href: string) => {
      if (animating.current || href === pathname) return;
      animating.current = true;
      pendingEnter.current = true;

      // LEAVE — columns rise from the bottom to cover the screen, then navigate.
      gsap.set(overlayRef.current, { pointerEvents: "auto" });
      const tl = gsap.timeline({ onComplete: () => router.push(href) });
      tl.fromTo(
        colsRef.current,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.6, stagger: 0.07, ease: EASE },
      );
      tl.to(
        asteriskRef.current,
        { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(1.7)" },
        "-=0.35",
      );

      // Safety net: if the route never commits, still reveal instead of hanging.
      if (failsafe.current) clearTimeout(failsafe.current);
      failsafe.current = setTimeout(() => {
        if (pendingEnter.current) {
          pendingEnter.current = false;
          runEnter();
        }
      }, 1200);
    },
    [pathname, router, runEnter],
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-200 flex"
      >
        {COLUMNS.map((color, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) colsRef.current[i] = el;
            }}
            className={cn("h-full flex-1", color)}
          />
        ))}

        <div
          ref={asteriskRef}
          className="pointer-events-none fixed inset-0 grid place-items-center"
        >
          <Asterisk className="size-24 text-brand-lime sm:size-32" />
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}
