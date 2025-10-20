import { Metadata } from "next";
import Script from "next/script";
import LocaleProvider from "../../context/locale-provider";
import StylingProvider from "../../context/theme-provider";
import {
  getSimplePageBySlug,
  getSiteSettings,
} from "../../lib/contentful-graphql";
import "../globals.css";

// Layout components would be imported here
// import { Header, Footer } from '@/components/layout';

interface LayoutConfig {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  _props: LayoutConfig,
): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.siteName || "Ariane Guay";
  const defaultSeo = siteSettings?.defaultSeo as
    | { title?: string; description?: string; keywords?: string[] }
    | undefined;

  return {
    title: {
      default: defaultSeo?.title || siteName,
      template: `${siteName} | %s`,
    },
    description:
      defaultSeo?.description ||
      "Personal website and portfolio of Ariane Guay",
    keywords: defaultSeo?.keywords || ["design", "development", "portfolio"],
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "https://arianeguay.ca",
    ),
    openGraph: {
      type: "website",
      locale: "en_CA",
      siteName,
    },
    robots: {
      index: true,
      follow: true,
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    },
  };
}

export default async function SiteLayout(props: LayoutConfig) {
  const { children, params } = props;
  const slug = params.slug || "home";

  const { page: currentPage, otherLocalePage } = await getSimplePageBySlug(
    slug,
    {
      locale: "en",
    },
  );

  return (
    <html lang="en">
      <body>
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-setup" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
              `}
            </Script>
          </>
        ) : null}
        <StylingProvider>
          <LocaleProvider
            locale="en"
            currentPage={currentPage}
            otherLocalePage={otherLocalePage}
          >
            {children}
          </LocaleProvider>
        </StylingProvider>
      </body>
    </html>
  );
}
