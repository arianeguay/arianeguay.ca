import { Metadata } from "next";
import "../globals.css";
import Header from "../../components/layout/header";
import { Footer } from "../../components/layout";
import StylingProvider from "../../context/theme-provider";
import { getSiteSettings } from "../../lib/contentful-graphql";
import { GlobalStyle } from "../../theme/global-style";
import ScrollHijacker from "../../components/scroll/ScrollHijacker";

// Layout components would be imported here
// import { Header, Footer } from '@/components/layout';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Ariane Guay",
      template: "%s | Ariane Guay",
    },
    description: "Personal website and portfolio of Ariane Guay",
    keywords: ["design", "development", "portfolio"],
    metadataBase: new URL(process.env.SITE_URL || "https://arianeguay.ca"),
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName: "Ariane Guay",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SiteLayout(props: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { children, params } = props;
  const siteSettings = await getSiteSettings();
  const paramsValues = await params

  const pathname = !!paramsValues.slug ? `/${paramsValues.slug}` : "/";

  return (
    <html lang="en">
      <body>
        <GlobalStyle />
        <StylingProvider>
          <Header nav={siteSettings?.navCollection?.items} currentPath={pathname} />
          <ScrollHijacker />

          <main
            style={{
              minHeight: "100vh",
              width: "100%",
            }}
          >
            {children}
          </main>

          <Footer
            copyright={siteSettings?.footer?.copyright}
            socials={siteSettings?.socials}
          />
        </StylingProvider>
      </body>
    </html>
  );
}
