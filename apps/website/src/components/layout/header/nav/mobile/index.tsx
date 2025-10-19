"use client";

import { NavItem } from "apps/website/src/types/settings";
import { HeaderNavStyled } from "../../styles";

interface MobileNavProps {
  nav: NavItem[];
}
const MobileNav = ({ nav }: MobileNavProps) => {
  return <HeaderNavStyled></HeaderNavStyled>;
};

export default MobileNav;
