import Sections from "apps/website/src/components/layout/sections";
import {
  getAllPageSlugs,
  getPageBySlug,
} from "apps/website/src/lib/contentful-graphql";
import type { Metadata } from "next";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug =( await params).slug;
  const page = await getPageBySlug(slug);
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

export default async function Page({ params }:PageProps) {
  const slug =( await params).slug;
  const page = await getPageBySlug(slug);

  if (!page || !page.sectionsCollection?.items) {
    // In static export, missing pages should be excluded by generateStaticParams.
    // This is a safeguard during dev.
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Page not found</h1>
      </div>
    );
  }

  return (
    <Sections sections={page.sectionsCollection?.items} />
  );
}
