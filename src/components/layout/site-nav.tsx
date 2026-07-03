"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Asterisk, Mail, X } from "lucide-react";
import type { IconType } from "react-icons";
import { SiGithub, SiInstagram } from "react-icons/si";
import { LuLinkedin } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TransitionLink } from "@/components/motion/transition-link";

type NavLink = {
  label: string;
  href: string;
  badge?: string;
  meta?: string;
  icon?: IconType;
};

const EMAIL = "mailto:fauzannmuhh@gmail.com";

// In-page sections (anchors) plus the standalone Gallery route. Anchors render
// as plain <a>; "/canvas" starts with "/" so MenuColumn routes it through the
// page transition.
const SECTIONS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Gallery", href: "/canvas" },
];

const CONNECT: NavLink[] = [
  { label: "GitHub", href: "https://github.com/muhfauzannn", icon: SiGithub },
  // TODO: replace with your real LinkedIn URL.
  { label: "LinkedIn", href: "#", icon: LuLinkedin },
  // TODO: replace with your real Instagram URL.
  { label: "Instagram", href: "#", icon: SiInstagram },
  { label: "Email", href: EMAIL, icon: Mail },
];

export function SiteNav() {
  const [open, setOpen] = React.useState(false);

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
            "mx-auto border rounded-md border-white/10 bg-brand-charcoal/85 text-brand-cream shadow-lg shadow-black/20 backdrop-blur-xl",
            "transition-[max-width,border-radius,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "max-w-3xl bg-brand-charcoal/95" : "max-w-xl ",
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
              aria-label="Home"
              className="flex items-center gap-2 font-heading font-bold"
            >
              <Asterisk className="size-7 text-brand-lime" />
            </TransitionLink>

            <div className="flex items-center gap-1.5">
              <Button size="pill" className="hidden sm:inline-flex" asChild>
                <a href={EMAIL}>Get in touch</a>
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
                <MenuColumn
                  title="Explore"
                  links={SECTIONS}
                  onSelect={() => setOpen(false)}
                />
                <MenuColumn
                  title="Connect"
                  links={CONNECT}
                  onSelect={() => setOpen(false)}
                />

                {/* Portrait image. */}
                <div className="relative min-h-40 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <Image
                    src="/fauzan.webp"
                    alt="Fauzan"
                    fill
                    sizes="(min-width: 640px) 20rem, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function MenuColumn({
  title,
  links,
  onSelect,
}: {
  title: string;
  links: NavLink[];
  onSelect?: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-2">
      <p className="px-2 pt-1.5 pb-1 text-[0.7rem] font-medium tracking-wide text-brand-cream/50">
        {title}
      </p>
      <ul>
        {links.map((link) => {
          // Internal routes animate via the page transition; anchors/external
          // links are plain <a>. External links open in a new tab.
          const Cmp = link.href.startsWith("/") ? TransitionLink : "a";
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <Cmp
                href={link.href}
                onClick={onSelect}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group flex items-center justify-between gap-2 rounded-xl px-2 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-brand-cream"
              >
                <span className="flex items-center gap-2">
                  {link.icon ? (
                    <link.icon
                      className="size-4 text-brand-cream/60"
                      aria-hidden
                    />
                  ) : null}
                  {link.label}
                  {link.badge ? (
                    <Badge variant="purple" className="text-[0.65rem]">
                      {link.badge}
                    </Badge>
                  ) : null}
                </span>
                {link.meta ? (
                  <span className="text-xs text-brand-cream/40">
                    {link.meta}
                  </span>
                ) : (
                  <ArrowUpRight className="size-4 -translate-x-1 text-brand-cream/40 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                )}
              </Cmp>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
