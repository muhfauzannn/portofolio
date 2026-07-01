"use client";

import * as React from "react";

import { usePageTransition } from "@/components/motion/page-transition";

type TransitionLinkProps = React.ComponentProps<"a"> & { href: string };

/**
 * Drop-in replacement for <a>/<Link> that plays the page transition before
 * navigating. Use for internal route changes; external links or hash anchors
 * should keep a plain <a>.
 */
export function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();

  return (
    <a
      href={href}
      onClick={(e) => {
        // Let modifier/middle clicks fall through to native navigation.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.(e);
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
