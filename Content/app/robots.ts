import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Crawler rules — everything public is indexable; backend paths don't live here. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
