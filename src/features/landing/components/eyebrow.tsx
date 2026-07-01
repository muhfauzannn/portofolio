import * as React from "react";

import { cn } from "@/lib/utils";

/** Small uppercase section label with a leading rule. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase",
        className
      )}
    >
      <span className="h-px w-8 bg-foreground/30" />
      {children}
    </div>
  );
}
