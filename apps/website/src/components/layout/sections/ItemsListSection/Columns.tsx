import theme from "apps/website/src/theme";
import { ItemsList } from "apps/website/src/types/shared";

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
          <div key={item?.text + index}>
            <h3>{item?.text}</h3>
          </div>
        );
      })}
    </div>
  );
};

export default ItemsListColumns;
