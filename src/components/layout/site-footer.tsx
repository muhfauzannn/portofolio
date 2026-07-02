import { TransitionLink } from "@/components/motion/transition-link";
import { FooterWordmark } from "@/components/layout/footer-wordmark";

type FooterLink = { label: string; href: string };

const LINKS: FooterLink[] = [
  { label: "Work", href: "#top" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
];

/**
 * Site footer — a giant overflowing wordmark (FAUZAN, repeated and clipped at
 * both edges) over a mono meta bar: nav pills, copyright, and a credit badge.
 * Presentational chrome shared across routes.
 */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-background pt-16">
      {/* Oversized wordmark — decorative; overflows the viewport on both sides
          and bows with scroll. */}
      <FooterWordmark />
      <span className="sr-only">Muhammad Fauzan</span>

      {/* Meta bar. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 pt-8 pb-8 font-mono text-[0.7rem] tracking-widest text-muted-foreground uppercase sm:px-6">
        <nav className="flex flex-wrap items-center gap-1.5">
          {LINKS.map((link) => {
            const Cmp = link.href.startsWith("/") ? TransitionLink : "a";
            return (
              <Cmp
                key={link.label}
                href={link.href}
                className="rounded-full bg-brand-charcoal px-3 py-1.5 text-brand-cream transition-colors hover:bg-brand-charcoal/85"
              >
                {link.label}
              </Cmp>
            );
          })}
        </nav>

        <p className="order-last w-full text-center sm:order-none sm:w-auto">
          © {new Date().getFullYear()} Muhammad Fauzan
        </p>

        <div className="flex items-center gap-1.5">
          <span>Created by</span>
          <a
            href="https://github.com/muhfauzannn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-brand-purple px-3 py-1.5 text-brand-purple-foreground transition-colors hover:bg-brand-purple/85"
          >
            Fauzan
          </a>
        </div>
      </div>
    </footer>
  );
}
