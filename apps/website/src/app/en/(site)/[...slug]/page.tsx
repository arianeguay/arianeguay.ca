import ProjectSingle from "apps/website/src/components/layout/project-single";
import Sections from "apps/website/src/components/layout/sections";
import {
  getAllPageSlugsWithParents,
  getAllWorkSlugsWithParents,
  getPageBySlug,
  getSimplePageBySlug,
  getWorkBySlug,
} from "apps/website/src/lib/contentful-graphql";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const dynamic = "error";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const entries = await getAllPageSlugsWithParents("en");
  const projects = await getAllWorkSlugsWithParents("en");

  const pageEntries = entries.map((e) => ({
    slug: [e.parentSlug, e.slug].filter(Boolean),
  }));

  const workEntries = projects.map((e) => ({
    slug: [e.slug].filter(Boolean),
  }));

  return [...pageEntries, ...workEntries];
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: parts } = await params;
  const slug = parts?.[parts.length - 1];
  let title = "Ariane Guay";
  let description: string | undefined = undefined;
  let canonicalUrl: string | undefined = undefined;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://arianeguay.ca";
  let otherLocaleUrl: string | undefined = undefined;
  const currentLocaleUrl = `${baseUrl}/en/${parts.join("/")}`;

  // Prefer Page SEO if exists; otherwise fallback to WorkItem SEO
  const { page, otherLocalePage } = await getSimplePageBySlug(slug, {
    locale: "en",
  });
  if (page) {
    const seo = page.seo;
    title = seo?.seoTitle || page.title || title;
    description = seo?.seoDescription || undefined;
    canonicalUrl = seo?.canonicalUrl || undefined;
    otherLocaleUrl = otherLocalePage?.slug
      ? `${baseUrl}/${otherLocalePage.slug}`
      : undefined;
  } else {
    const work = await getWorkBySlug(slug, { locale: "en" });
    const seo = (work as any)?.seo;
    title = seo?.seoTitle || work?.title || title;
    description = seo?.seoDescription || undefined;
    canonicalUrl = seo?.canonicalUrl || undefined;
  }
  return {
    title,
    description,
    robots: undefined,
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
      images: undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const resParams = await params;
  const parts = resParams.slug;
  const slug = parts?.[parts.length - 1];
  if (!slug) return notFound();
  if (slug === "home") return redirect("/en");

  const page = await getPageBySlug(slug, { locale: "en" });
  if (page && page.sectionsCollection?.items) {
    return <Sections sections={page.sectionsCollection?.items} />;
  }
  // Fallback to WorkItem
  const work = await getWorkBySlug(slug, { locale: "en" });
  if (work) {
    return <ProjectSingle data={work} />;
  }
  return notFound();
}
