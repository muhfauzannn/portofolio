"use client";

import dynamic from "next/dynamic";

// Client-only: the library fetches the graph on mount and its loading skeleton
// doesn't match on the server, so skip SSR to avoid a hydration mismatch.
const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((m) => m.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <div className="h-40 w-full animate-pulse rounded-lg bg-muted" />
    ),
  },
);

// Lime → charcoal ramp (5 levels: empty → most active). Light mode goes
// lime→charcoal; dark mode is flipped (charcoal→lime) so cells stay visible.
const THEME = {
  light: ["#ebedf0", "#d6f45b", "#a4c53e", "#5a6a2a", "#1a1a1a"],
  dark: ["#1f1f1a", "#3f4a20", "#7a9430", "#aacb3a", "#d6f45b"],
};

/**
 * GitHub contribution calendar for the given username.
 */
export function GithubContributions({ username }: { username: string }) {
  return (
    <div className="w-full overflow-x-auto">
      <GitHubCalendar
        username={username}
        theme={THEME}
        blockSize={13}
        blockMargin={4}
        fontSize={14}
        errorMessage={`Couldn't load @${username}'s contributions right now.`}
      />
    </div>
  );
}
