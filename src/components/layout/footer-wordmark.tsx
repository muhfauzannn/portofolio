"use client";

import * as React from "react";

const TEXT = "FAUZANFAUZANFAUZAN";
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

/**
 * The oversized footer wordmark. Each letter is offset vertically along a
 * parabola whose amplitude is driven by scroll — the line bows further as the
 * footer rises into view, and flattens again on the way back up. Decorative;
 * the accessible name lives in the footer as sr-only text.
 */
export function FooterWordmark() {
  const ref = React.useRef<HTMLDivElement>(null);
  const letters = React.useMemo(() => TEXT.split(""), []);

  React.useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(
      container.querySelectorAll<HTMLElement>(".footer-letter"),
    );
    const n = els.length;
    if (!n) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = container.getBoundingClientRect();
      const h = rect.height || 1;
      // 0 when the wordmark's top is at the viewport bottom (just entering),
      // 1 once it has fully risen into view.
      const p = clamp((window.innerHeight - rect.top) / h, 0, 1);
      const amp = window.innerWidth * 0.05 * p;
      els.forEach((el, i) => {
        const x = n > 1 ? (i / (n - 1)) * 2 - 1 : 0;
        el.style.transform = `translateY(${amp * (1 - x * x)}px)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="flex justify-center overflow-hidden">
      <span className="font-heading mb-8 text-[18vw] leading-[0.8] font-bold tracking-tighter whitespace-nowrap text-foreground uppercase select-none">
        {letters.map((ch, i) => (
          <span
            key={i}
            className="footer-letter inline-block will-change-transform"
          >
            {ch}
          </span>
        ))}
      </span>
    </div>
  );
}
