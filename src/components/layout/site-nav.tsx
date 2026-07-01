"use client";

import * as React from "react";
import { Menu, MoonStar, Sparkles, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const LINKS = ["Assets", "Courses", "Vault", "Community"];

export function SiteNav() {
  const [dark, setDark] = React.useState(false);

  const toggleTheme = React.useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
  }, []);

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-5xl px-4">
      {/* Sticky top nav = perfect horizontal capsule (DESIGN.md §2A) */}
      <nav className="flex items-center justify-between gap-2 rounded-full border border-border/70 bg-background/80 py-2 pr-2 pl-5 shadow-lg shadow-foreground/5 backdrop-blur-xl">
        <a href="#top" className="flex items-center gap-2 font-heading font-bold">
          <span className="grid size-7 place-items-center rounded-full bg-brand-lime text-brand-lime-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="tracking-tight">Toolkit</span>
          <Badge variant="lime" className="ml-1 hidden sm:inline-flex">
            V3
          </Badge>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l}>
              <a
                href="#top"
                className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

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
          <Button size="pill" className="hidden sm:inline-flex">
            Get started
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-heading">Toolkit</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {LINKS.map((l) => (
                  <a
                    key={l}
                    href="#top"
                    className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                  >
                    {l}
                  </a>
                ))}
                <Button size="pill" className="mt-3">
                  Get started
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
