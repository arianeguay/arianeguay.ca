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

export async function generateMetadata(): Promise<Metadata> {
  const siteName = "Ariane Guay";
  return {
    title: {
      default: siteName,
      template: `${siteName} | %s`,
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

export default async function SiteLayout({ children }: LayoutConfig) {
  const { page: currentPage, otherLocalePage } = await getSimplePageBySlug(
    "home",
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
