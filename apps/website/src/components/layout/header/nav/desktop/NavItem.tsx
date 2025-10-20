import { useLocale } from "apps/website/src/context/locale-provider";
import type { NavItem } from "apps/website/src/types/settings";
import { Page } from "apps/website/src/types/shared";
import Link from "next/link";
import { useState } from "react";
import { NavItemStyled } from "../../styles";
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

const getFullHandle = (page: Page, locale: string) => {
  const parentSlug: string | undefined = page?.parentPage?.slug;

  const href = [locale !== "fr" && "en", parentSlug, page.slug]
    .filter(Boolean)
    .join("/");
  console.log(href, parentSlug, page.slug, locale);
  return `/${href}`;
};

const NavItem: React.FC<NavItemProps> = ({
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
              {label} ▾
            </NavItemStyled>
          </DropdownMenuTrigger>
          <DropdownMenuContent $open={open}>
            <DropdownMenuList>
              {subitemsCollection?.items?.map((subitem) => (
                <DropdownMenuItem key={subitem.label}>
                  <Link href={getFullHandle(subitem.page, locale)}>
                    {subitem.label}
                  </Link>
                </DropdownMenuItem>
              ))}
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

export default NavItem;
