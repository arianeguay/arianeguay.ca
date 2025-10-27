import { ItemsList } from "apps/website/src/types/shared";
import ItemRender from "./ItemRender";
import { ColumnStyled } from "./styles";

const ItemsListColumns: React.FC<ItemsList> = ({
  itemsCollection,
  cardVariant,
}) => {
  return (
    <ColumnStyled>
      {itemsCollection?.items.map((item, index) => {
        return (
          <ItemRender
            key={index}
            item={item}
            cardVariant={cardVariant ?? "rows"}
          />
        );
      })}
    </ColumnStyled>
  );
};

export default ItemsListColumns;
