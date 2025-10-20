import type { NavItem } from "apps/website/src/types/settings";
import { NavItemStyled } from "../../styles";

interface NavItemProps extends NavItem {
  currentPath: string;
}
const NavItem: React.FC<NavItemProps> = ({ label, page, currentPath }) => {
  const handle = page.slug === "home" ? "/" : `/${page.slug}`;

  return (
    <NavItemStyled
      href={handle}
      $active={currentPath === handle}
      aria-label={label}
      about={`Go to ${label}`}
    >
      {label}
    </NavItemStyled>
  );
};

export default NavItem;
