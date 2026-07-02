"use client";

import * as React from "react";
import { ArrowUpRight, MoonStar, Sparkles, Sun, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransitionLink } from "@/components/motion/transition-link";

type NavLink = { label: string; href: string; badge?: string; meta?: string };

const PRODUCTS: NavLink[] = [
  { label: "The Vault", href: "#vault" },
  { label: "Page Transition Course", href: "#course" },
  { label: "Button Pack", href: "#buttons", badge: "New" },
  { label: "Community", href: "#community" },
];

const EXPLORE: NavLink[] = [
  { label: "Work", href: "/tes", meta: "12" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

export function SiteNav() {
  const [open, setOpen] = React.useState(false);
  const [dark, setDark] = React.useState(false);

  const toggleTheme = React.useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, []);

  // Close on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Spacer reserves the collapsed nav's height so switching the header to
          fixed keeps the page layout identical — and the mega-menu can now
          unfurl without pushing anything down. */}
      <div aria-hidden className="h-14.5 shrink-0" />

      <header className="fixed inset-x-0 top-4 z-50 px-4">
        {/* Backdrop — click anywhere to collapse the expanded menu. */}
        <button
          type="button"
          aria-hidden={!open}
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className={cn(
            "fixed inset-0 -z-10 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-500",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />

        {/*
        Single morphing capsule (OSMO-style): collapsed it's a compact pill;
        when active it grows in width and unfurls the mega-menu below.
      */}
        <div
          className={cn(
            "mx-auto border rounded-md border-border/70 bg-background/85 shadow-lg shadow-foreground/5 backdrop-blur-xl",
            "transition-[max-width,border-radius,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "max-w-3xl bg-background/95" : "max-w-xl ",
          )}
        >
          {/* Top bar — kept outside any clip so its text never gets cut mid-morph */}
          <nav className="flex items-center justify-between gap-2 py-2 pr-2 pl-3 whitespace-nowrap">
            <Button
              variant="ghost"
              size="pill"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="gap-2 text-sm font-medium"
            >
              <span className="relative grid size-4 place-items-center">
                <X
                  className={cn(
                    "absolute size-4 transition-all duration-300",
                    open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute flex w-4 flex-col gap-1 transition-all duration-300",
                    open ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                  )}
                >
                  <span className="h-0.5 w-full rounded-full bg-current" />
                  <span className="h-0.5 w-full rounded-full bg-current" />
                </span>
              </span>
              Menu
            </Button>

            <TransitionLink
              href="/"
              className="flex items-center gap-2 font-heading font-bold"
            >
              <span className="grid size-7 place-items-center rounded-full bg-brand-lime text-brand-lime-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="tracking-tight">Toolkit</span>
            </TransitionLink>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {dark ? <Sun /> : <MoonStar />}
              </Button>
              <Button size="pill" className="hidden sm:inline-flex" asChild>
                <TransitionLink href="/contact">Get started</TransitionLink>
              </Button>
            </div>
          </nav>

          {/* Mega-menu — height unfurls via the grid-rows trick. */}
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="overflow-hidden">
              <div
                className={cn(
                  "grid gap-4 p-3 pt-1 transition-opacity duration-500 sm:grid-cols-[1fr_1fr_1.1fr]",
                  open ? "opacity-100 delay-100" : "opacity-0",
                )}
              >
                <MenuColumn title="Our products" links={PRODUCTS} />
                <MenuColumn title="Explore" links={EXPLORE} />

                {/* Feature card */}
                <a
                  href="#course"
                  className="group flex flex-col justify-between gap-4 rounded-2xl bg-brand-charcoal p-4 text-brand-cream"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.7rem] font-medium tracking-wide text-brand-cream/60 uppercase">
                      Start learning
                    </span>
                    <Badge variant="lime">New</Badge>
                  </div>
                  <div>
                    <p className="font-heading text-lg leading-tight font-semibold">
                      Page Transition Course
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm text-brand-cream/70 transition-colors group-hover:text-brand-lime">
                      More info
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function MenuColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-2">
      <p className="px-2 pt-1.5 pb-1 text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </p>
      <ul>
        {links.map((link) => {
          // Internal routes animate via the page transition; "#" anchors don't.
          const Cmp = link.href.startsWith("/") ? TransitionLink : "a";
          return (
            <li key={link.label}>
              <Cmp
                href={link.href}
                className="group flex items-center justify-between gap-2 rounded-xl px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.badge ? (
                    <Badge variant="purple" className="text-[0.65rem]">
                      {link.badge}
                    </Badge>
                  ) : null}
                </span>
                {link.meta ? (
                  <span className="text-xs text-muted-foreground">
                    {link.meta}
                  </span>
                ) : (
                  <ArrowUpRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                )}
              </Cmp>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
