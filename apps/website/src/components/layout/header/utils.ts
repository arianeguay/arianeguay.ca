import type { Page } from "apps/website/src/types/shared";

export const getFullHandle = (page: Page, locale: string) => {
  const parentSlug: string | undefined = page?.parentPage?.slug;

  if (page.slug === "home") {
    return locale === "fr" ? "/" : "/en";
  }
  const href = [locale !== "fr" && "en", parentSlug, page.slug]
    .filter(Boolean)
    .join("/");
  return `/${href}`;
};
