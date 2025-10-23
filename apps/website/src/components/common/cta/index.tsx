import { LinkItem } from "apps/website/src/types/shared";
import { CTAStyled } from "./styles";
import CTAWrapper from "./wrapper";

interface CTAProps {
  data: LinkItem;
}
const CTA: React.FC<CTAProps> = ({ data }) => {
  const variant = data.variant || "primary";
  return (
    <CTAWrapper data={data}>
      <CTAStyled $variant={variant}>{data.label}</CTAStyled>
    </CTAWrapper>
  );
};

export default CTA;
