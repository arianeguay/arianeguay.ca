import type { MetadataRoute } from "next";
import { getAllPageSlugs } from "../lib/contentful-graphql";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://arianeguay.ca";

  // Homepage entry
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    const slugs = await getAllPageSlugs();
    for (const slug of slugs) {
      // Avoid duplicating homepage if slug corresponds to root
      if (!slug || slug === "/" || slug === "index" || slug === "home") continue;
      entries.push({
        url: `${baseUrl}/${slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (e) {
    // If Contentful is not configured during build, still return homepage-only sitemap
    console.warn("Sitemap generation warning:", e);
  }

  return entries;
}

// Ensure static generation for static HTML export builds
export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours
