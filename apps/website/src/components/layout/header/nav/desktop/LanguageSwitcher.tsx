"use client";

import Button from "apps/website/src/components/common/button";
import { useLocale } from "apps/website/src/context/locale-provider";
import { PageEntry } from "apps/website/src/lib/contentful-graphql";
import Link from "next/link";

function getSwitchHref(locale: string, otherLocalePage: PageEntry) {
  const slug =
    otherLocalePage.slug === "home" ? "/" : `/${otherLocalePage.slug}`;
  if (locale === "fr") {
    return `/en${slug}`;
  }
  return `${slug}`;
}

const LanguageSwitcher = () => {
  const { locale, otherLocalePage } = useLocale();
  if (!otherLocalePage) return null;
  const href = getSwitchHref(locale, otherLocalePage);

  return (
    <Link href={href}>
      <Button variant="outline" size="sm">
        {locale === "fr" ? "EN" : "FR"}
      </Button>
    </Link>
  );
};

export default LanguageSwitcher;
