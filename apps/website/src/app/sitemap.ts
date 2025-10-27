import type { MetadataRoute } from "next";
import { getAllPageSlugsWithParents } from "../lib/contentful-graphql";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://arianeguay.ca";

  // Homepage entry
  const entries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  try {
    const [frSlugs, enSlugs] = await Promise.all([
      getAllPageSlugsWithParents("fr"),
      getAllPageSlugsWithParents("en"),
    ]);

    for (const { slug, parentSlug, noindex } of frSlugs) {
      if (noindex) continue;
      // Avoid duplicating homepage if slug corresponds to root
      if (!slug || slug === "/" || slug === "index" || slug === "home")
        continue;
      const url = parentSlug
        ? `${baseUrl}/${parentSlug}/${slug}`
        : `${baseUrl}/${slug}`;
      entries.push({
        url,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const { slug, parentSlug, noindex } of enSlugs) {
      if (noindex) continue;
      if (!slug || slug === "/" || slug === "index" || slug === "home")
        continue;
      const url = parentSlug
        ? `${baseUrl}/en/${parentSlug}/${slug}`
        : `${baseUrl}/en/${slug}`;
      entries.push({
        url,
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
