import { ItemsList } from "apps/website/src/types/shared";
import DefaultCard from "./Card/Default";
import { GridStyled } from "./styles";

const Grid: React.FC<ItemsList> = ({ itemsCollection }) => {
  return (
    <GridStyled>
      {itemsCollection?.items.map((item, index) => {
        return <DefaultCard key={item?.text + index} {...item} />;
      })}
    </GridStyled>
  );
};

export default Grid;
