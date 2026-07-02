"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * First-load intro. Charcoal columns wipe up to fill the screen, a typing
 * effect cycles "hello" through a few languages, then "I'm Muhammad Fauzan"
 * appears and the name flies + scales to land pixel-matched on the hero <h1>
 * (#hero-name) — a FLIP-style shared-element handoff. Runs once per browser
 * session. Colors/motion follow DESIGN.md §4.
 */

const COLUMNS = Array.from({ length: 7 });
const EASE = "power4.inOut";
const STORAGE_KEY = "intro-played";

// Greetings across languages — cycled with a typing effect.
const GREETINGS = ["Hello", "Ciao", "Hola", "Bonjour", "こんにちは", "Halo"];

export function IntroOverlay() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const colsRef = React.useRef<HTMLDivElement[]>([]);
  const greetWrapRef = React.useRef<HTMLDivElement>(null);
  const greetRef = React.useRef<HTMLSpanElement>(null);
  const cursorRef = React.useRef<HTMLSpanElement>(null);
  const nameWrapRef = React.useRef<HTMLDivElement>(null);
  const prefixRef = React.useRef<HTMLSpanElement>(null);
  const nameRef = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const greet = greetRef.current;
      const name = nameRef.current;
      const heroName = document.querySelector<HTMLElement>("#hero-name");
      if (!root || !greet || !name || !heroName) return;

      // Already seen this session → don't replay; leave the page untouched.
      if (sessionStorage.getItem(STORAGE_KEY)) {
        gsap.set(root, { display: "none" });
        return;
      }

      // Hide the real heading behind the columns until the handoff lands.
      // (useGSAP runs before paint, so there's no flash of the hero name.)
      gsap.set(heroName, { opacity: 0 });
      gsap.set(colsRef.current, { yPercent: 100 });
      gsap.set(greetWrapRef.current, { opacity: 1 });
      gsap.set(nameWrapRef.current, { opacity: 0 });
      gsap.set(prefixRef.current, { opacity: 0, yPercent: 40 });
      gsap.set(name, {
        opacity: 0,
        yPercent: 40,
        transformOrigin: "center center",
      });

      // Blinking caret for the typing phase (independent of the timeline).
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });

      // Measured at handoff time so it matches the hero at any breakpoint.
      const fit = { x: 0, y: 0, scale: 1, color: "" };

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(heroName, { opacity: 1 });
          gsap.set(root, { display: "none" });
          sessionStorage.setItem(STORAGE_KEY, "1");
        },
      });

      // Append a character-by-character type-in / type-out of `str` onto `tl`.
      const typeIn = (str: string) =>
        tl.to(
          { n: 0 },
          {
            n: str.length,
            duration: str.length / 18,
            ease: "none",
            onUpdate() {
              greet.textContent = str.slice(0, Math.round(this.targets()[0].n));
            },
          },
        );
      const typeOut = (str: string) =>
        tl.to(
          { n: str.length },
          {
            n: 0,
            duration: str.length / 26,
            ease: "none",
            onUpdate() {
              greet.textContent = str.slice(0, Math.round(this.targets()[0].n));
            },
          },
        );

      // 1 — columns rise from the bottom to cover the screen.
      tl.to(colsRef.current, {
        yPercent: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: EASE,
      });

      // 2 — cycle the greetings with a typing effect.
      GREETINGS.forEach((word) => {
        typeIn(word);
        tl.to({}, { duration: 0.45 });
        typeOut(word);
      });

      // 3 — fade the greeting out, bring the name in, hold a beat.
      tl.to(greetWrapRef.current, { opacity: 0, duration: 0.3 });
      tl.set(nameWrapRef.current, { opacity: 1 });
      tl.to(prefixRef.current, {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
        ease: "power3.out",
      });
      tl.to(
        name,
        { opacity: 1, yPercent: 0, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      );
      tl.to({}, { duration: 0.6 });

      // 4 — measure both boxes, then fly/scale the name onto the hero heading
      //     while the "I'm" prefix fades and the columns clear off the top.
      tl.call(() => {
        const from = name.getBoundingClientRect();
        const to = heroName.getBoundingClientRect();
        fit.scale = to.width / from.width;
        fit.x = to.left + to.width / 2 - (from.left + from.width / 2);
        fit.y = to.top + to.height / 2 - (from.top + from.height / 2);
        fit.color = getComputedStyle(heroName).color;
      });
      tl.to(prefixRef.current, { opacity: 0, duration: 0.3 });
      tl.to(
        name,
        {
          x: () => fit.x,
          y: () => fit.y,
          scale: () => fit.scale,
          color: () => fit.color,
          duration: 0.9,
          ease: EASE,
          immediateRender: false,
        },
        "<",
      );
      tl.to(
        colsRef.current,
        { yPercent: -100, duration: 0.9, stagger: 0.05, ease: EASE },
        "<",
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-300 flex overflow-hidden"
    >
      {COLUMNS.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) colsRef.current[i] = el;
          }}
          className="h-full flex-1 bg-brand-charcoal"
        />
      ))}

      <div className="pointer-events-none fixed inset-0 grid place-items-center px-4">
        {/* Greeting typing phase */}
        <div
          ref={greetWrapRef}
          className="font-heading flex items-center text-4xl text-brand-cream [grid-area:1/1] sm:text-7xl"
        >
          <span ref={greetRef} />
          <span ref={cursorRef} className="text-brand-lime">
            |
          </span>
        </div>

        {/* Name phase — "Muhammad Fauzan" hands off to the hero heading */}
        <div
          ref={nameWrapRef}
          className="flex flex-col items-center gap-0 [grid-area:1/1]"
        >
          <span
            ref={prefixRef}
            className="font-script text-2xl text-brand-lime sm:text-4xl"
          >
            I&apos;m
          </span>
          <span
            ref={nameRef}
            className={cn(
              "font-heading tracking-tight whitespace-nowrap text-brand-cream",
              "text-4xl sm:text-7xl",
            )}
          >
            Muhammad Fauzan
          </span>
        </div>
      </div>
    </div>
  );
}
