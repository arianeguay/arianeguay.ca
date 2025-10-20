import type { Metadata } from "next";
import Sections from "../../../components/layout/sections";
import {
  getPageBySlug,
  getSimplePageBySlug,
} from "../../../lib/contentful-graphql";
import { getSiteSettings } from "../../../lib/contentful-graphql";
import Header from "../../../components/layout/header";
import { Footer } from "../../../components/layout";
import ScrollHijacker from "../../../components/scroll/ScrollHijacker";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getSimplePageBySlug("home", { locale: "en" });
  const seo = page?.seo;
  const title = seo?.seoTitle || page?.title || "Ariane Guay";
  const description = seo?.seoDescription || undefined;
  const canonicalUrl = seo?.canonicalUrl || undefined;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://arianeguay.ca";

  return {
    title,
    description,
    robots: seo?.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl || `${baseUrl}/en`,
      languages: {
        "fr-CA": `${baseUrl}/`,
        "en-CA": `${baseUrl}/en`,
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

export default async function HomeEn() {
  const page = await getPageBySlug("home", { locale: "en" });
  const siteSettings = await getSiteSettings("en");

  if (!page || !page.sectionsCollection?.items) {
    return <h1 className="text-3xl font-bold">Home page not found</h1>;
  }

  return (
    <>
      <Header nav={siteSettings?.navCollection?.items} />
      <ScrollHijacker />
      <main
        style={{
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <Sections sections={page.sectionsCollection?.items} />
      </main>
      <Footer
        copyright={siteSettings?.footer?.copyright}
        socials={siteSettings?.socials}
      />
    </>
  );
}
