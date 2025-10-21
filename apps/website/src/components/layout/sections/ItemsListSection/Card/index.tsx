import { ItemsListCardVariant, ListItem } from "apps/website/src/types/shared";
import CardTile from "./Card";
import CitationTile from "./Citation";
import FaqTile from "./FAQ";
import RowTile from "./Row";

export interface CardProps extends ListItem {
  text: string;
  variant?: ItemsListCardVariant;
  noWrap?: boolean;
}
const Card: React.FC<CardProps> = (props) => {
  const { variant } = props;
  switch (variant) {
    case "faq":
      return <FaqTile {...props} />;
    case "rows":
      return <RowTile {...props} />;
    case "citation":
      return <CitationTile {...props} />;
    default:
      return <CardTile {...props} />;
  }
};

export default Card;
