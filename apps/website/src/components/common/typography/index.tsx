import { CustomTheme } from "apps/website/src/theme";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Span,
  Div,
  TypographyStyledProps,
} from "./styles";
type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div";
type TypographyVariant = keyof CustomTheme["typography"];
const getTypographyElement = (element: TypographyElement) => {
  switch (element) {
    case "h1":
      return H1;
    case "h2":
      return H2;
    case "h3":
      return H3;
    case "h4":
      return H4;
    case "h5":
      return H5;
    case "h6":
      return H6;
    case "p":
      return P;
    case "span":
      return Span;
    case "div":
      return Div;
    default:
      return Div;
  }
};
interface TypographyProps {
  element: TypographyElement;
  variant: TypographyVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  noWrap?: boolean;
}
const Typography: React.FC<TypographyProps> = ({
  element,
  variant,
  children,
  noWrap,
  className,
  id,
  style,
}) => {
  const Element = getTypographyElement(element);
  return (
    <Element
      $variant={variant}
      style={{ ...style, whiteSpace: noWrap ? "nowrap" : "wrap" }}
      className={className}
      id={id}
    >
      {children}
    </Element>
  );
};

export default Typography;
