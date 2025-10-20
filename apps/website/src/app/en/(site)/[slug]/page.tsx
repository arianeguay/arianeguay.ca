import LocaleProvider from "apps/website/src/context/locale-provider";
import type { Metadata } from "next";
import Sections from "../../../../components/layout/sections";
import {
  getAllPageSlugs,
  getPageBySlug,
  getSimplePageBySlug,
} from "../../../../lib/contentful-graphql";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs("en");
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  const { page, otherLocalePage } = await getSimplePageBySlug(slug, {
    locale: "en",
  });
  const seo = page?.seo;

  const title = seo?.seoTitle || page?.title || "Ariane Guay";
  const description = seo?.seoDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || undefined;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://arianeguay.ca";

  const otherLocaleUrl = otherLocalePage?.slug
    ? `${baseUrl}/${otherLocalePage.slug}`
    : undefined;

  const currentLocaleUrl = `${baseUrl}/en/${slug}`;
  return {
    title,
    description,
    robots: seo?.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
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

export default async function PageEn({ params }: PageProps) {
  const slug = (await params).slug;
  const page = await getPageBySlug(slug, { locale: "en" });

  const { page: currentPage, otherLocalePage } = await getSimplePageBySlug(
    slug,
    {
      locale: "en",
    },
  );

  if (!page || !page.sectionsCollection?.items) {
    return (
      <LocaleProvider
        locale="en"
        currentPage={currentPage}
        otherLocalePage={otherLocalePage}
      >
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold">Page not found</h1>
        </div>
      </LocaleProvider>
    );
  }

  return <Sections sections={page.sectionsCollection?.items} />;
}
