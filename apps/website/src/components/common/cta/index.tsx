import { LinkItem } from "apps/website/src/types/shared";
import { CTAStyled } from "./styles";
import CTAWrapper from "./wrapper";

interface CTAProps {
  data: LinkItem;
  style?: React.CSSProperties;
}
const CTA: React.FC<CTAProps> = ({ data, style }) => {
  const variant = data.variant || "primary";
  return (
    <CTAWrapper data={data} style={style}>
      <CTAStyled $variant={variant}>{data.label}</CTAStyled>
    </CTAWrapper>
  );
};

export default CTA;
