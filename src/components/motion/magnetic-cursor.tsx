"use client";

import * as React from "react";

/**
 * Custom magnetic cursor accent (DESIGN.md §6.1).
 * A lime dot that lags behind the pointer to create a sense of magnetism.
 * Hidden on touch devices and when reduced motion is requested.
 */
export function MagneticCursor() {
  const dotRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const dot = dotRef.current;
    if (!dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = "1";
      // Grow over interactive targets for a subtle hover magnet.
      const interactive = (e.target as HTMLElement)?.closest(
        "a,button,[role='button']"
      );
      dot.style.transform = interactive ? "scale(2.4)" : "scale(1)";
    };

    const tick = () => {
      x += (mouseX - x) * 0.18;
      y += (mouseY - y) * 0.18;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed z-[100] hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-lime opacity-0 mix-blend-difference transition-[transform,opacity] duration-200 ease-out md:block"
    />
  );
}
