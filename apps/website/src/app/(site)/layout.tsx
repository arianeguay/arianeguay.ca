import { Metadata } from "next";
import { Footer } from "../../components/layout";
import Header from "../../components/layout/header";
import ScrollHijacker from "../../components/scroll/ScrollHijacker";
import StylingProvider from "../../context/theme-provider";
import { getSiteSettings } from "../../lib/contentful-graphql";
import "../globals.css";

// Layout components would be imported here
// import { Header, Footer } from '@/components/layout';

interface LayoutConfig {
  children: React.ReactNode;
}

export async function generateMetadata(
  _props: LayoutConfig,
): Promise<Metadata> {
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

export default async function SiteLayout(props: LayoutConfig) {
  const { children } = props;
  const siteSettings = await getSiteSettings();

  return (
    <html lang="en">
      <body>
        <StylingProvider>
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
        </StylingProvider>
      </body>
    </html>
  );
}
