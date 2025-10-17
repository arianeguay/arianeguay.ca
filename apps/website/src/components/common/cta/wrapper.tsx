import { LinkItem } from "apps/website/src/types/shared";
import Link from "next/link";

interface CTAWrapperProps {
  children: React.ReactNode;
  data: LinkItem;
}
const CTAWrapper: React.FC<CTAWrapperProps> = ({ children, data }) => {
  const { url, page, kind } = data;

  switch (kind) {
    case "Internal":
      const slug = page?.slug;
      if (!slug) return children;

      const handle = slug === "home" ? "/" : `/${slug}`;
      return <Link href={handle}>{children}</Link>;
    case "External":
      if (!url) return children;
      return <a href={url}>{children}</a>;
    default:
      return children;
  }
};

export default CTAWrapper;
