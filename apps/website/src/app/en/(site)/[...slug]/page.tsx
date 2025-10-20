import Sections from "apps/website/src/components/layout/sections";
import {
  getAllPageSlugsWithParents,
  getPageBySlug,
  getSimplePageBySlug,
} from "apps/website/src/lib/contentful-graphql";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const entries = await getAllPageSlugsWithParents("en");
  return entries
    .filter((e) => e.parentSlug)
    .map((e) => ({ slug: [e.parentSlug as string, e.slug] }));
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const parts = (await params).slug;
  const slug = parts?.[parts.length - 1];
  const { page, otherLocalePage } = await getSimplePageBySlug(slug, {
    locale: "en",
  });
  const seo = page?.seo;

  const title = seo?.seoTitle || page?.title || "Ariane Guay";
  const description = seo?.seoDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || undefined;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://arianeguay.ca";

  const otherLocaleUrl = otherLocalePage?.slug
    ? `${baseUrl}/${otherLocalePage.slug}`
    : undefined;

  const currentLocaleUrl = `${baseUrl}/en/${parts.join("/")}`;
  return {
    title,
    description,
    robots: seo?.noindex ? { index: false, follow: false } : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl || currentLocaleUrl,
      languages: {
        "fr-CA": otherLocaleUrl,
        "en-CA": currentLocaleUrl,
      },
    },
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

export default async function Page({ params }: PageProps) {
  const parts = (await params).slug;
  const slug = parts?.[parts.length - 1];
  if (!slug) return notFound();
  const page = await getPageBySlug(slug, { locale: "en" });
  if (!page || !page.sectionsCollection?.items) return notFound();

  return <Sections sections={page.sectionsCollection?.items} />;
}
