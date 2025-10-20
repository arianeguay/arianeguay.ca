import { ReactNode } from "react";
import { Footer } from "apps/website/src/components/layout";
import Header from "apps/website/src/components/layout/header";
import ScrollHijacker from "apps/website/src/components/scroll/ScrollHijacker";
import LocaleProvider from "apps/website/src/context/locale-provider";
import StylingProvider from "apps/website/src/context/theme-provider";
import { getAllPageSlugs, getSimplePageBySlug, getSiteSettings } from "apps/website/src/lib/contentful-graphql";

interface LayoutProps {
  children: ReactNode;
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs("en");
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export default async function SlugLayoutEn({ children, params }: LayoutProps) {
  const slug = params.slug || "home";
  const siteSettings = await getSiteSettings("en");
  const { page: currentPage, otherLocalePage } = await getSimplePageBySlug(slug, { locale: "en" });

  return (
    <StylingProvider>
      <LocaleProvider locale="en" currentPage={currentPage} otherLocalePage={otherLocalePage}>
        <Header nav={siteSettings?.navCollection?.items} />
        <ScrollHijacker />
        <main
          style={{
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
        <Footer
          copyright={siteSettings?.footer?.copyright}
          socials={siteSettings?.socials}
        />
      </LocaleProvider>
    </StylingProvider>
  );
}
