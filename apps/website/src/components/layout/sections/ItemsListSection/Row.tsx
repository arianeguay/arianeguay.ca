import { ItemsList } from "apps/website/src/types/shared";
import ItemRender from "./ItemRender";
import { RowStyled } from "./styles";

const Row: React.FC<ItemsList> = ({ itemsCollection, cardVariant }) => {
  return (
    <RowStyled>
      {itemsCollection?.items.map((item, index) => {
        return (
          <ItemRender
            key={index}
            item={item}
            cardVariant={cardVariant ?? "rows"}
            textAlign="center"
            noWrap
          />
        );
      })}
    </RowStyled>
  );
};

export default Row;
