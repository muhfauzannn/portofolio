import type { CSSProperties } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Reveal } from "@/components/motion/reveal";
import { SKILLS } from "@/features/skills/data/skills";

// Hand-scattered jitter — fixed (not Math.random) so server and client render
// the same markup. Values cycle if there are more skills than entries.
const TILT = [-9, 7, -4, 11, -13, 5, -7, 14, -6, 9, -11, 4]; // deg
const SHIFT = [12, -8, 18, -4, 9, -14, 22, -2, 6, -18, 14, -6]; // px (y)

/**
 * A scattered pile of tool cards, each tossed at a random angle and offset.
 * Hovering one lifts it upright and reveals its name in a tooltip.
 */
export function SkillsFan() {
  return (
    <Reveal delay={200} className="mt-12 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-y-6">
        {SKILLS.map(({ name, Icon, color }, i) => {
          const style = {
            "--r": `${TILT[i % TILT.length]}deg`,
            "--y": `${SHIFT[i % SHIFT.length]}px`,
          } as CSSProperties;

          return (
            <li key={name} className="-mx-2 sm:-mx-1.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={name}
                    style={style}
                    className="relative z-0 grid size-20 cursor-pointer place-items-center rounded-2xl border border-border bg-white shadow-lg shadow-foreground/10 transition-[transform,box-shadow] duration-300 ease-out transform-[translateY(var(--y))_rotate(var(--r))] hover:z-20 hover:shadow-2xl hover:shadow-foreground/20 hover:transform-[translateY(-1rem)_rotate(0deg)_scale(1.1)] focus-visible:z-20 focus-visible:outline-none focus-visible:transform-[translateY(-1rem)_rotate(0deg)_scale(1.1)] sm:size-24"
                  >
                    <span
                      className="text-3xl sm:text-4xl"
                      style={color ? { color } : undefined}
                    >
                      <Icon aria-hidden />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={12} className="text-sm font-medium">
                  {name}
                </TooltipContent>
              </Tooltip>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
