import { useLocale } from "apps/website/src/context/locale-provider";
import type { NavItem } from "apps/website/src/types/settings";
import { MobileNavItemStyled } from "./styles";
interface NavItemProps extends NavItem {
  currentPath: string;
}
const NavItem: React.FC<NavItemProps> = ({ label, page, currentPath }) => {
  const { locale } = useLocale();
  const handle = page.slug === "home" ? "/" : `/${page.slug}`;
  const localisedHandle = locale === "fr" ? handle : `/${locale}${handle}`;
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
