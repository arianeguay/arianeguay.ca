import theme from "apps/website/src/theme";
import { ItemsList } from "apps/website/src/types/shared";
import Card from "./Card";
import ServiceCard from "./ServiceCard";
import WorkItemCard from "./WorkItem";

const ItemsListColumns: React.FC<ItemsList> = ({
  itemsCollection,
  cardVariant,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.md,
      }}
    >
      {itemsCollection?.items.map((item, index) => {
        switch (item.__typename) {
          case "Page":
            return (
              <ServiceCard
                key={item?.title ?? item.__typename + index}
                {...item}
              />
            );
          case "WorkItem":
            return (
              <WorkItemCard
                key={item?.title ?? item.__typename + index}
                {...item}
              />
            );
          case "ListItem":
            return (
              <Card
                key={item?.text ?? item.__typename + index}
                {...item}
                variant={cardVariant ?? "rows"}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default ItemsListColumns;
