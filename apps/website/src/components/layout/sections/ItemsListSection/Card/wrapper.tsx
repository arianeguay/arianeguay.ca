import { ListItem } from "apps/website/src/types/shared";
import { CardLinkStyled } from "./styles";
interface CardWrapperProps {
  children: React.ReactNode;
  data: ListItem;
  style?: React.CSSProperties;
}
const CardWrapper: React.FC<CardWrapperProps> = ({ children, data, style }) => {
  if (data.page) {
    const locale = data.page.sys?.locale;
    const fullSlug = [
      locale === "en" ? "en" : null,
      data.page.parentPage?.slug,
      data.page.slug,
    ]
      .filter(Boolean)
      .join("/");
    return (
      <CardLinkStyled href={`/${fullSlug}`} style={style}>
        {children}
      </CardLinkStyled>
    );
  }
  return children;
};

export default CardWrapper;
