import { ItemsList } from "apps/website/src/types/shared";
import ItemRender from "./ItemRender";
import { GridStyled } from "./styles";

const Grid: React.FC<ItemsList> = ({ itemsCollection, cardVariant }) => {
  const hasOddNb = (itemsCollection?.items.length ?? 0) % 2;
  return (
    <GridStyled $hasOddNb={!!hasOddNb}>
      {itemsCollection?.items.map((item, index) => {
        return (
          <ItemRender
            key={index}
            item={item}
            cardVariant={cardVariant ?? "rows"}
          />
        );
      })}
    </GridStyled>
  );
};

export default Grid;
