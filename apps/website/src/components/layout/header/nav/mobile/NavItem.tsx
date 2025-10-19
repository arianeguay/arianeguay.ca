import type { NavItem } from "apps/website/src/types/settings";
import { MobileNavItemStyled } from "./styles";

interface NavItemProps extends NavItem {
  currentPath: string;
}
const NavItem: React.FC<NavItemProps> = ({ label, page, currentPath }) => {
  const handle = page.slug === "home" ? "/" : `/${page.slug}`;

  return (
    <MobileNavItemStyled href={handle} $active={currentPath === handle}>
      {label}
    </MobileNavItemStyled>
  );
};

export default NavItem;
