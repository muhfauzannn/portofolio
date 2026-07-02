import { ExperienceTimeline } from "@/features/experience/components/experience-timeline";

/**
 * Experience feature — composes the section from its self-contained parts.
 */
export function ExperiencePage() {
  return (
    <main className="flex-1">
      <ExperienceTimeline />
    </main>
  );
}
