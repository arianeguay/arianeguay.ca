import { SectionBlock } from "apps/website/src/types/blocks";
import Container from "../../container";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { ItemsList } from "apps/website/src/types/shared";
import Grid from "./Grid";
import ItemsListColumns from "./Columns";
import Scroller from "./Scroller";
import ItemsListSectionStyled from "./styles";

interface ItemsListSectionProps {
  data: ItemsList;
}

const ItemsListSectionContent: React.FC<ItemsListSectionProps> = ({ data }) => {
  const { variant } = data;
  switch (variant) {
    case "verticalGrid":
      return <Grid {...data} />;
    case "twoColsLeft":
      return <ItemsListColumns {...data} />;
    case "twoColsRight":
      return <ItemsListColumns {...data} />;
    case "verticalScroll":
      return <Scroller {...data} />;
  }
};

const ItemsListSection: React.FC<ItemsListSectionProps> = ({ data }) => {
  const { title, description, variant } = data;

  const textAlign = ["verticalScroll", "verticalGrid"].includes(
    variant ?? "column",
  )
    ? "center"
    : "left";

  console.log(variant,data);
  return (
    <Container>
      <ItemsListSectionStyled $variant={variant ?? "twoColsLeft"}>
        <div>
          <h2 style={{ textAlign }}>{title}</h2>
          {description && (
            <div style={{ textAlign }}>
              {documentToReactComponents(description.json)}
            </div>
          )}
        </div>
        <ItemsListSectionContent data={data} />
      </ItemsListSectionStyled>
    </Container>
  );
};

export default ItemsListSection;
