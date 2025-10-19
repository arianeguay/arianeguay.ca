import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import theme from "apps/website/src/theme";
import { CTASection } from "apps/website/src/types/shared";
import CTA from "../../../common/cta";
import Typography from "../../../common/typography";
import Container from "../../container";
import { CtaSectionBodyStyled, CtaSectionContentStyled } from "./styles";

interface CTASectionProps {
  data: CTASection;
  isHero?: boolean;
}
const CTASectionComponent: React.FC<CTASectionProps> = ({ data, isHero }) => {
  console.log(data.splashesCollection?.items);
  return (
    <Container
      style={{
        paddingBlockStart:
          isHero && !data.isScreen ? theme.spacing.xxxxxxl : undefined,
      }}
      isScreen={!!data.isScreen}
      background={data.background ?? "none"}
      splashes={data.splashesCollection?.items ?? []}
    >
      <CtaSectionContentStyled $variation={data.variant ?? "horizontal"}>
        {!!data.illustration && (
          <img
            src={data.illustration.url}
            alt={data.illustration.title ?? ""}
          />
        )}
        <CtaSectionBodyStyled>
          {!!data.title && (
            <Typography
              element={isHero ? "h1" : "h2"}
              variant={isHero ? "h1" : "h2"}
            >
              {data.title}
            </Typography>
          )}
          {!!data.description?.json && (
            <Typography element="div" variant="body1">
              {documentToReactComponents(data.description.json)}
            </Typography>
          )}
          {!!data.primaryCta && <CTA data={data.primaryCta} />}
        </CtaSectionBodyStyled>
      </CtaSectionContentStyled>
    </Container>
  );
};

export default CTASectionComponent;
