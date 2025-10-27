import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  getServicePages,
  getWorkItems,
} from "apps/website/src/lib/contentful-graphql";
import {
  ItemsList,
  ItemsListIncludeAllType,
} from "apps/website/src/types/shared";
import CTA from "../../../common/cta";
import Typography from "../../../common/typography";
import Container from "../../container";
import ItemsListColumns from "./Columns";
import Grid from "./Grid";
import Row from "./Row";
import Scroller from "./Scroller";
import ItemsListSectionStyled from "./styles";

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
    case "verticalRow":
      return <Row {...data} />;
  }
};

const fetchAdditionalItems = async (
  locale: string,
  type: ItemsListIncludeAllType,
) => {
  if (!type || type === "disabled") return [];

  if (type === "projects") {
    const res = await getWorkItems({ locale, kind: "projects" });
    return res;
  }

  if (type === "workItems") {
    const res = await getWorkItems({ locale, kind: "all" });
    return res;
  }

  if (type === "caseStudy") {
    const res = await getWorkItems({ locale, kind: "caseStudy" });
    return res;
  }

  if (type === "services") {
    const res = await getServicePages(locale);
    return res;
  }

  return [];
};

const ItemsListSection: React.FC<ItemsListSectionProps> = async ({
  data,
  isHero,
}) => {
  const {
    title,
    description,
    variant,
    isScreen,
    background,
    primaryCta,
    includeAll,
    splashesCollection,
  } = data;
  const additionalItems = await fetchAdditionalItems(
    "fr",
    includeAll ?? "disabled",
  );
  const isVertical = ["verticalScroll", "verticalGrid", "verticalRow"].includes(
    variant ?? "column",
  );
  const textAlign = isVertical ? "center" : "left";

  return (
    <Container
      splashes={splashesCollection?.items}
      isScreen={isScreen ?? false}
      background={background ?? "none"}
    >
      <ItemsListSectionStyled $variant={variant ?? "twoColsLeft"}>
        <div
          style={{
            maxWidth: "100%",
            marginInline: "auto",
          }}
        >
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
          {!!primaryCta && (
            <CTA data={primaryCta} style={{ marginInline: "auto" }} />
          )}
        </div>
        <ItemsListSectionContent
          data={{
            ...data,
            itemsCollection: {
              items: [
                ...(data.itemsCollection?.items ?? []),
                ...additionalItems,
              ],
            },
          }}
        />
      </ItemsListSectionStyled>
    </Container>
  );
};

export default ItemsListSection;
