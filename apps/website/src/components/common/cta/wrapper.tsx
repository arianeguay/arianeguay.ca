"use client";
import { useLocale } from "apps/website/src/context/locale-provider";
import { LinkItem } from "apps/website/src/types/shared";
import Link from "next/link";
import ActionModalWrapper from "./actions-modals";
interface CTAWrapperProps {
  children: React.ReactNode;
  data: LinkItem;
  style?: React.CSSProperties;
}
const CTAWrapper: React.FC<CTAWrapperProps> = ({ children, data, style }) => {
  const { url, page, kind, actionForm } = data;
  const { locale } = useLocale();
  switch (kind) {
    case "Internal":
      const slug = page?.slug;
      if (!slug) return children;
      const parentSlug: string | undefined = (page as any)?.parentPage?.slug;
      const basePath =
        slug === "home"
          ? "/"
          : parentSlug
            ? `/${parentSlug}/${slug}`
            : `/${slug}`;
      const href = locale === "fr" ? basePath : `/${locale}${basePath}`;
      return (
        <Link href={href} style={style}>
          {children}
        </Link>
      );
    case "External":
      if (!url) return children;
      return (
        <a href={url} style={style}>
          {children}
        </a>
      );
    case "Action":
      if (!actionForm) return children;
      return (
        <ActionModalWrapper actionForm={actionForm} style={style}>
          {children}
        </ActionModalWrapper>
      );
    default:
      return children;
  }
};

export default CTAWrapper;
