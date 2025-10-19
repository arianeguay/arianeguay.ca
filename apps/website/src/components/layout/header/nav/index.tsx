"use client";

import { useBreakpointDown } from "apps/website/src/hooks/useMediaQuery";
import DesktopNav from "./desktop";
import NavItem from "./desktop/NavItem";
import MobileNav from "./mobile";

interface HeaderNavProps {
  nav: NavItem[];
}
const HeaderNav = ({ nav }: HeaderNavProps) => {
  const isMobile = useBreakpointDown("md");

  return isMobile ? <MobileNav nav={nav} /> : <DesktopNav nav={nav} />;
};

export default HeaderNav;
