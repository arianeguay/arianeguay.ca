import theme from "apps/website/src/theme";
import { ItemsList } from "apps/website/src/types/shared";
import Card from "./Card";

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
        return (
          <Card
            key={item?.text + index}
            {...item}
            variant={cardVariant ?? "rows"}
          />
        );
      })}
    </div>
  );
};

export default ItemsListColumns;
