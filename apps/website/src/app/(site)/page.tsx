import type { Metadata } from "next";
import Sections from "../../components/layout/sections";
import { getPageBySlug } from "../../lib/contentful-graphql";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("home");
  const seo = page?.seo;
  const title = seo?.seoTitle || page?.title || "Ariane Guay";
  const description = seo?.seoDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || undefined;

  return {
    title,
    description,
    robots: seo?.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: seo?.ogImage?.url
        ? [{ url: seo.ogImage.url, alt: seo.ogImage.title || title }]
        : undefined,
    },
  };
}

export default async function Home() {
  const page = await getPageBySlug("home");

  if (!page || !page.sectionsCollection?.items) {
    return <h1 className="text-3xl font-bold">Home page not found</h1>;
  }

  return <Sections sections={page.sectionsCollection?.items} />;
}
