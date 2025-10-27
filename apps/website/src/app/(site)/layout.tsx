import { Metadata } from "next";
import Script from "next/script";
import LocaleProvider from "../../context/locale-provider";
import StylingProvider from "../../context/theme-provider";
import { getSimplePageBySlug } from "../../lib/contentful-graphql";
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
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "https://arianeguay.ca",
    ),
    openGraph: {
      type: "website",
      locale: "fr_CA",
      siteName: "Ariane Guay",
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
  const { children } = props;

  const { page: currentPage, otherLocalePage } = await getSimplePageBySlug(
    "home",
    {
      locale: "fr",
    },
  );

  return (
    <html lang="fr">
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
            locale="fr"
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
