import { CFItem } from "apps/website/src/cms/cf-graphql";
import { NavItem } from "apps/website/src/types/settings";
import Logo from "./logo";
import HeaderNav from "./nav";
import { HeaderContentStyled, HeaderStyled } from "./styles";

interface HeaderProps {
  nav: CFItem<NavItem, "NavItem">[];
}

const Header: React.FC<HeaderProps> = ({ nav }: HeaderProps) => {
  return (
    <HeaderStyled>
      <HeaderContentStyled>
        <Logo />
        <HeaderNav nav={nav} />
      </HeaderContentStyled>
    </HeaderStyled>
  );
};

export default Header;
