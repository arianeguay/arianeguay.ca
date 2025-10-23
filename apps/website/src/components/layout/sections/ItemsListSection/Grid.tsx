import { ItemsList } from "apps/website/src/types/shared";
import Card from "./Card";
import ServiceCard from "./ServiceCard";
import { GridStyled } from "./styles";
import WorkItemCard from "./WorkItem";

const Grid: React.FC<ItemsList> = ({ itemsCollection, cardVariant }) => {
  console.log(itemsCollection);
  return (
    <GridStyled>
      {itemsCollection?.items.map((item, index) => {
        switch (item.__typename) {
          case "Page":
            return <ServiceCard key={item.__typename + index} {...item} />;
          case "WorkItem":
            return <WorkItemCard key={item.__typename + index} {...item} />;
          case "ListItem":
            return (
              <Card
                key={item.__typename + index}
                {...item}
                variant={cardVariant ?? "rows"}
              />
            );
        }
      })}
    </GridStyled>
  );
};

export default Grid;
