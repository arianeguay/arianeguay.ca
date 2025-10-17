import { NavItem } from "apps/website/src/types/settings";
import Logo from "./logo";
import { HeaderContentStyled, HeaderNavStyled, HeaderStyled } from "./styles";
import NavItemComponent from "./NavItem";
import { CFItem } from "apps/website/src/cms/cf-graphql";
interface HeaderProps {
  nav: CFItem<NavItem, "NavItem">[];
  currentPath: string;
}
const Header: React.FC<HeaderProps> = ({ nav, currentPath }: HeaderProps) => {
  return (
    <HeaderStyled>
      <HeaderContentStyled>
        <Logo />
        <HeaderNavStyled>
          {nav?.map((item) => (
            <NavItemComponent key={item.sys.id} {...item} currentPath={currentPath} />
          ))}
        </HeaderNavStyled>
      </HeaderContentStyled>
    </HeaderStyled>
  );
};
export default Header;
