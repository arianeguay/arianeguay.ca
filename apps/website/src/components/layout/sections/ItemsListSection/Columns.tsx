import theme from "apps/website/src/theme";
import { ItemsList } from "apps/website/src/types/shared";
import { DefaultCard } from "./Card";

const ItemsListColumns: React.FC<ItemsList> = ({ itemsCollection }) => {
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
         <DefaultCard key={item?.text + index} {...item} />
        );
      })}
    </div>
  );
};

export default ItemsListColumns;
