"use client";

import { useState } from "react";
import Logo from "../../logo";
import NavItem from "./NavItem";
import {
  DrawerContentStyled,
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
            <NavItem currentPath={currentPath} key={item.label} {...item} />
          ))}
        </DrawerContentStyled>
      </DrawerStyled>
    </>
  );
};

export default MobileNav;
