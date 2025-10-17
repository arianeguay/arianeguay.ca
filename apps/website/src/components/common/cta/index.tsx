import { LinkItem } from "apps/website/src/types/shared"
import CTAWrapper from "./wrapper"
import { CTAStyled } from "./styles"

interface CTAProps {
    data: LinkItem
}
const CTA: React.FC<CTAProps> = ({data}) => {
    const variant = data.variant || "primary";
    return (
        <CTAWrapper data={data}>
            <CTAStyled $variant={variant}>{data.label}</CTAStyled>
        </CTAWrapper>
    )
}

export default CTA