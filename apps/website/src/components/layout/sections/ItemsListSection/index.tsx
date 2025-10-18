import { SectionBlock } from "apps/website/src/types/blocks";
import Container from "../../container";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { ItemsList } from "apps/website/src/types/shared";
import Grid from "./Grid";
import ItemsListColumns from "./Columns";
import Scroller from "./Scroller";
import ItemsListSectionStyled from "./styles";
import Typography from "../../../common/typography";

interface ItemsListSectionProps {
  data: ItemsList;
  isHero?: boolean;
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

const ItemsListSection: React.FC<ItemsListSectionProps> = ({
  data,
  isHero,
}) => {
  const { title, description, variant, isScreen, background } = data;

  const textAlign = ["verticalScroll", "verticalGrid"].includes(
    variant ?? "column",
  )
    ? "center"
    : "left";

  console.log(variant, data);
  return (
    <Container isScreen={isScreen ?? false} background={background ?? "none"}>
      <ItemsListSectionStyled $variant={variant ?? "twoColsLeft"}>
        <div>
          {!!title && (
            <Typography
              element={isHero ? "h1" : "h2"}
              style={{ textAlign, width: "100%" }}
              variant={isHero ? "h1" : "h2"}
            >
              {title}
            </Typography>
          )}
          {!!description?.json && (
            <Typography element="div" variant="body1" style={{ textAlign }}>
              {documentToReactComponents(description.json)}
            </Typography>
          )}
        </div>
        <ItemsListSectionContent data={data}  />
      </ItemsListSectionStyled>
    </Container>
  );
};

export default ItemsListSection;
