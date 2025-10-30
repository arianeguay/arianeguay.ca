"use client";

import Button from "apps/website/src/components/common/button";
import { useLocale } from "apps/website/src/context/locale-provider";
import { PageEntry } from "apps/website/src/lib/contentful-graphql";
import Link from "next/link";

function getSwitchHref(locale: string, otherLocalePage: PageEntry) {
  const slug = otherLocalePage?.slug || "home";
  const parentSlug: string | undefined = (otherLocalePage as any)?.parentPage
    ?.slug;
  const basePath =
    slug === "home" ? "/" : parentSlug ? `/${parentSlug}/${slug}` : `/${slug}`;
  if (locale === "fr") {
    return `/en${basePath}`;
  }
  return `${basePath}`;
}

const getLanguageLabel = (locale: string, isSmall: boolean) => {
  if (isSmall) {
    return locale === "fr" ? "EN" : "FR";
  }
  return locale === "fr" ? "English" : "Français";
};

interface LanguageSwitcherProps {
  type?: "small" | "default";
}
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  type = "default",
}) => {
  const { locale, otherLocalePage } = useLocale();
  if (!otherLocalePage) return null;
  const href = getSwitchHref(locale, otherLocalePage);

  return (
    <Link href={href}>
      <Button variant="outline" size={type === "small" ? "sm" : "md"}>
        {getLanguageLabel(locale, type === "small")}
      </Button>
    </Link>
  );
};

export default LanguageSwitcher;
