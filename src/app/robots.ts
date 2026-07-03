import type { MetadataRoute } from "next";

// Generates /robots.txt — allow the public site, keep the CMS out of crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    },
  };
}
