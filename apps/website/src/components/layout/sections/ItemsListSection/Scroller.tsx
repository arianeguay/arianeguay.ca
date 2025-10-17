import { ItemsList } from "apps/website/src/types/shared";

const Scroller: React.FC<ItemsList> = ({ itemsCollection }) => {
  return (
    <div>
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

export default Scroller;
