"use client";
import { useLocale } from "apps/website/src/context/locale-provider";
import { LinkItem } from "apps/website/src/types/shared";
import Link from "next/link";
import ActionModalWrapper from "./actions-modals";
interface CTAWrapperProps {
  children: React.ReactNode;
  data: LinkItem;
}
const CTAWrapper: React.FC<CTAWrapperProps> = ({ children, data }) => {
  const { url, page, kind, actionForm } = data;
  const { locale } = useLocale();
  switch (kind) {
    case "Internal":
      const slug = page?.slug;
      if (!slug) return children;

      const handle = slug === "home" ? "/" : `/${slug}`;
      return (
        <Link href={locale === "fr" ? handle : `/${locale}${handle}`}>
          {children}
        </Link>
      );
    case "External":
      if (!url) return children;
      return <a href={url}>{children}</a>;
    case "Action":
      if (!actionForm) return children;
      return (
        <ActionModalWrapper actionForm={actionForm}>
          {children}
        </ActionModalWrapper>
      );
    default:
      return children;
  }
};

export default CTAWrapper;
