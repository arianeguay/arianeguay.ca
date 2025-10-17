import { CTASection } from "apps/website/src/types/shared";
import Container from "../../container";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { CtaSectionContentStyled } from "./styles";
import CTA from "../../../common/cta";
import Typography from "../../../common/typography";

interface CTASectionProps {
  data: CTASection;
}
const CTASectionComponent: React.FC<CTASectionProps> = ({ data }) => {
  console.log(data);
  return (
    <Container
      isScreen={!!data.isScreen}
      background={data.background ?? "none"}
    >
      <CtaSectionContentStyled $variation={data.variant ?? "horizontal"}>
        {!!data.illustration && (
          <img
            src={data.illustration.url}
            alt={data.illustration.title ?? ""}
          />
        )}
        <div>
          {!!data.title && <h2>{data.title}</h2>}
          {!!data.description?.json &&
          <Typography element="div" variant="body1">
            {documentToReactComponents(data.description.json)}
          </Typography>}
          {!!data.primaryCta && <CTA data={data.primaryCta} />}
        </div>
      </CtaSectionContentStyled>
    </Container>
  );
};

export default CTASectionComponent;
