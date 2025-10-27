import { ItemsListCardVariant, ListItem } from "apps/website/src/types/shared";
import CardTile from "./Card";
import CitationTile from "./Citation";
import FaqTile from "./FAQ";
import RowTile from "./Row";

export interface CardProps extends ListItem {
  text: string;
  cardVariant?: ItemsListCardVariant;
  noWrap?: boolean;
  textAlign?: React.CSSProperties["textAlign"];
}
const Card: React.FC<CardProps> = (props) => {
  const { cardVariant } = props;
  switch (cardVariant) {
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
