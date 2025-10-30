import { useLocale } from "apps/website/src/context/locale-provider";
import type { NavItem } from "apps/website/src/types/settings";
import { getFullHandle } from "../../utils";
import {
  MobileNavItemLabel,
  MobileNavItemStyled,
  MobileSubNavItemStyled,
} from "./styles";
interface NavItemProps extends NavItem {
  currentPath: string;
}
const NavItemComponent: React.FC<NavItemProps> = ({
  label,
  page,
  subitemsCollection,
  currentPath,
}) => {
  const { locale } = useLocale();
  const href = getFullHandle(page, locale);
  return (
    <MobileNavItemStyled>
      <MobileNavItemLabel
        $active={currentPath === href}
        href={href}
        $hasSubitems={subitemsCollection.items.length > 0}
      >
        {label}
      </MobileNavItemLabel>
      {subitemsCollection.items.length > 0 &&
        subitemsCollection.items.map((item) => (
          <MobileSubNavItemStyled
            href={getFullHandle(item.page, locale)}
            $active={currentPath === getFullHandle(item.page, locale)}
            $variant={item.variant}
          >
            {item.label}
          </MobileSubNavItemStyled>
        ))}
    </MobileNavItemStyled>
  );
};

export default NavItemComponent;
