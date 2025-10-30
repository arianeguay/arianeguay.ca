import { useLocale } from "apps/website/src/context/locale-provider";
import type { NavItem } from "apps/website/src/types/settings";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { NavItemStyled } from "../../styles";
import { getFullHandle } from "../../utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuList,
  DropdownMenuTrigger,
} from "./styles";
interface NavItemProps extends NavItem {
  currentPath: string;
}

const NavItemComponent: React.FC<NavItemProps> = ({
  label,
  page,
  currentPath,
  subitemsCollection,
}) => {
  const { locale } = useLocale();
  const href = getFullHandle(page, locale);
  const [open, setOpen] = useState(false);
  return (
    <>
      {subitemsCollection?.items?.length > 0 ? (
        <DropdownMenu
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <DropdownMenuTrigger>
            <NavItemStyled
              href={href}
              $active={currentPath === href}
              aria-label={label}
              about={`Go to ${label}`}
            >
              {label} <ChevronDown size={20} />
            </NavItemStyled>
          </DropdownMenuTrigger>
          <DropdownMenuContent $open={open}>
            <DropdownMenuList>
              {subitemsCollection?.items?.map((subitem) => {
                const fullHandle = getFullHandle(subitem.page, locale);
                return (
                  <DropdownMenuItem
                    key={subitem.label}
                    $active={currentPath === fullHandle}
                    $variant={subitem.variant ?? "default"}
                  >
                    <Link href={fullHandle}>{subitem.label}</Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuList>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <NavItemStyled
          href={href}
          $active={currentPath === href}
          aria-label={label}
          about={`Go to ${label}`}
        >
          {label}
        </NavItemStyled>
      )}
    </>
  );
};

export default NavItemComponent;
