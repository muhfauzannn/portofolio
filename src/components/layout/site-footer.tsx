import { Send, Share2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FOOTER_COLUMNS = [
  { heading: "Product", links: ["Assets", "Vault", "Courses"] },
  { heading: "Company", links: ["About", "Blog", "Careers"] },
  { heading: "Legal", links: ["Terms", "Privacy", "License"] },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-charcoal px-4 py-16 text-brand-cream">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-heading text-xl font-bold">
              <span className="grid size-7 place-items-center rounded-full bg-brand-lime text-brand-lime-foreground">
                <Sparkles className="size-4" />
              </span>
              Toolkit
            </div>
            <p className="mt-4 text-sm text-white/60">
              The creative developer toolkit that ships. Bold, brutalist,
              polished.
            </p>
            <div className="mt-6 flex gap-2">
              <Button variant="charcoal" size="icon" className="rounded-full">
                <Share2 />
              </Button>
              <Button variant="charcoal" size="icon" className="rounded-full">
                <Send />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <div className="font-heading font-semibold">{col.heading}</div>
                {col.links.map((item) => (
                  <a
                    key={item}
                    href="#top"
                    className="text-white/60 transition-colors hover:text-brand-lime"
                  >
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <Separator className="my-10 bg-white/10" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-white/40 sm:flex-row">
          <span>© 2026 Toolkit. All rights reserved.</span>
          <span className="font-script text-lg text-brand-lime">
            made with care ✦
          </span>
        </div>
      </div>
    </footer>
  );
}
