import { ItemsListCardVariant, ItemTypes } from "apps/website/src/types/shared";
import Card from "./Card";
import ServiceCard from "./ServiceCard";
import WorkItemCard from "./WorkItem";

interface ItemRenderProps {
  item: ItemTypes;
  cardVariant?: ItemsListCardVariant;
  textAlign?: "left" | "center" | "right";
  noWrap?: boolean;
}
const ItemRender: React.FC<ItemRenderProps> = ({
  item,
  cardVariant,
  textAlign,
  noWrap,
}) => {
  switch (item.__typename) {
    case "Page":
      return <ServiceCard {...item} />;
    case "WorkItem":
      return <WorkItemCard {...item} />;
    case "ListItem":
      return (
        <Card
          {...item}
          cardVariant={cardVariant ?? "rows"}
          textAlign={textAlign}
          noWrap={noWrap}
        />
      );
  }
};

export default ItemRender;
