import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Tech-stack logos load from simple-icons' CDN (see TechBadge).
    remotePatterns: [{ protocol: "https", hostname: "cdn.simpleicons.org" }],
  },
};

export default nextConfig;
