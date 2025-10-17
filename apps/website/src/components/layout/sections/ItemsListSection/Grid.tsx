import { ItemsList } from "apps/website/src/types/shared";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

const Grid: React.FC<ItemsList> = ({itemsCollection}) => {
    return <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"2rem"}}>
        {itemsCollection?.items.map((item,index) => {
            return <div key={item?.text+index}>
                <h3>{item?.text}</h3>
            </div>;
        })}
    </div>;
};  

export default Grid;
