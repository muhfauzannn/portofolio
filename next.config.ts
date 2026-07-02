import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Tech-stack logos load from simple-icons' CDN (see TechBadge).
      { protocol: "https", hostname: "cdn.simpleicons.org" },
      // CMS-managed images/logos are served from Cloudflare R2's public bucket.
      // Set R2_PUBLIC_URL's hostname here (r2.dev or your custom domain).
      ...(process.env.R2_PUBLIC_URL
        ? [
            {
              protocol: "https" as const,
              hostname: new URL(process.env.R2_PUBLIC_URL).hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
