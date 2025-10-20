"use client";

import { NavItem } from "apps/website/src/types/settings";
import { usePathname } from "next/navigation";
import { HeaderNavStyled } from "../../styles";
import LanguageSwitcher from "./LanguageSwitcher";
import NavItemComponent from "./NavItem";

interface DesktopNavProps {
  nav: NavItem[];
}
const DesktopNav: React.FC<DesktopNavProps> = ({ nav }) => {
  const pathname = usePathname();
  const effectivePath = pathname ?? "/";

  return (
    <HeaderNavStyled>
      {nav?.map((item) => (
        <NavItemComponent
          key={item.label}
          {...item}
          currentPath={effectivePath}
        />
      ))}
      <LanguageSwitcher />
    </HeaderNavStyled>
  );
};

export default DesktopNav;
