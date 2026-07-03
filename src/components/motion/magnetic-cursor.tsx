"use client";

import * as React from "react";
import { Asterisk } from "lucide-react";

/**
 * Custom magnetic cursor accent (DESIGN.md §6.1).
 * A lime asterisk that lags behind the pointer for a sense of magnetism.
 * Over interactive targets it grows. Hidden on touch devices and when
 * reduced motion is requested.
 */
export function MagneticCursor() {
  const iconRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const icon = iconRef.current;
    if (!icon) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      icon.style.opacity = "1";
      const interactive = (e.target as HTMLElement)?.closest(
        "a,button,[role='button']",
      );
      icon.dataset.active = interactive ? "true" : "false";
    };

    const onLeave = () => {
      icon.style.opacity = "0";
    };

    const tick = () => {
      x += (mouseX - x) * 0.22;
      y += (mouseY - y) * 0.22;
      icon.style.left = `${x}px`;
      icon.style.top = `${y}px`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={iconRef}
      aria-hidden
      data-active="false"
      className="pointer-events-none fixed z-100 hidden -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-difference transition-[transform,opacity] duration-200 ease-out data-[active=true]:scale-[1.8] md:block"
    >
      <Asterisk className="size-6 text-brand-lime" />
    </div>
  );
}
