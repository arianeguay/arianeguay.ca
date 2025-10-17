import type { NavItem } from "apps/website/src/types/settings";
import { NavItemStyled } from "./styles";

interface NavItemProps extends NavItem {
  currentPath: string;
}
const NavItem: React.FC<NavItemProps> = async ({ label, page }) => {

  const handle = page.slug === "home" ? "/" : `/${page.slug}`;

  return (
    <NavItemStyled href={handle} >
      {label}
    </NavItemStyled>
  );
};

export default NavItem;
