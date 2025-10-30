"use client";

import { NavItem } from "apps/website/src/types/settings";
import { useState } from "react";
import Logo from "../../logo";
import LanguageSwitcher from "../desktop/LanguageSwitcher";
import NavItemComponent from "./NavItem";
import {
  DrawerContentStyled,
  DrawerFooterStyled,
  DrawerHeaderStyled,
  DrawerStyled,
  MobileToggleStyled,
} from "./styles";
import HeaderMobileToggle from "./toggle";

interface MobileNavProps {
  nav: NavItem[];
}
const MobileNav = ({ nav }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "/";
  return (
    <>
      <HeaderMobileToggle onClick={toggle} />
      <DrawerStyled $isOpen={isOpen}>
        <DrawerHeaderStyled>
          <Logo />
          <MobileToggleStyled onClick={toggle}>×</MobileToggleStyled>
        </DrawerHeaderStyled>
        <DrawerContentStyled>
          {nav.map((item) => (
            <NavItemComponent
              currentPath={currentPath}
              key={item.label}
              {...item}
            />
          ))}
        </DrawerContentStyled>
        <DrawerFooterStyled>
          <LanguageSwitcher type="default" />
        </DrawerFooterStyled>
      </DrawerStyled>
    </>
  );
};

export default MobileNav;
