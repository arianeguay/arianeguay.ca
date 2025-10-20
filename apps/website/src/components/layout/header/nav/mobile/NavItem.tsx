import { useLocale } from "apps/website/src/context/locale-provider";
import type { NavItem } from "apps/website/src/types/settings";
import { MobileNavItemStyled } from "./styles";
interface NavItemProps extends NavItem {
  currentPath: string;
}
const NavItem: React.FC<NavItemProps> = ({ label, page, currentPath }) => {
  const { locale } = useLocale();
  const parentSlug: string | undefined = (page as any)?.parentPage?.slug;
  const basePath =
    page.slug === "home" ? "/" : parentSlug ? `/${parentSlug}/${page.slug}` : `/${page.slug}`;
  const localisedHandle = locale === "fr" ? basePath : `/${locale}${basePath}`;
  return (
    <MobileNavItemStyled
      href={localisedHandle}
      $active={currentPath === localisedHandle}
    >
      {label}
    </MobileNavItemStyled>
  );
};

export default NavItem;
