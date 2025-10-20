import { Footer } from "apps/website/src/components/layout";
import Header from "apps/website/src/components/layout/header";
import ScrollHijacker from "apps/website/src/components/scroll/ScrollHijacker";
import LocaleProvider from "apps/website/src/context/locale-provider";
import StylingProvider from "apps/website/src/context/theme-provider";
import { getSimplePageBySlug, getSiteSettings } from "apps/website/src/lib/contentful-graphql";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string[] }>;
}

export default async function SlugLayout({ children, params }: LayoutProps) {
  const resParams = await params;
  const parts = resParams.slug || [];
  const slug = parts.length > 0 ? parts[parts.length - 1] : "home";
  const siteSettings = await getSiteSettings("fr");
  const { page: currentPage, otherLocalePage } = await getSimplePageBySlug(slug, {
    locale: "fr",
  });

  return (
    <StylingProvider>
      <LocaleProvider locale="fr" currentPage={currentPage} otherLocalePage={otherLocalePage}>
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
