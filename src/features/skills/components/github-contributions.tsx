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

// Lime-tinted scale (5 levels: empty → most active) to match the brand palette.
const THEME = {
  light: ["#ebedf0", "#eaf6a8", "#d6f45b", "#a9d63f", "#7fae1b"],
  dark: ["#26261f", "#3d4a1a", "#6f8f1f", "#a9d63f", "#d6f45b"],
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
