import { ItemsList } from "apps/website/src/types/shared";
import Card from "./Card";
import { GridStyled } from "./styles";

const Grid: React.FC<ItemsList> = ({ itemsCollection, cardVariant }) => {
  return (
    <GridStyled>
      {itemsCollection?.items.map((item, index) => {
        return (
          <Card
            key={item?.text + index}
            {...item}
            variant={cardVariant ?? "rows"}
          />
        );
      })}
    </GridStyled>
  );
};

export default Grid;
