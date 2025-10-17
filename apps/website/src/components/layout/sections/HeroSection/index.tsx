import { HeroSection } from "apps/website/src/types/shared"
import Container from "../../container"
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import CTA from "../../../common/cta"
import { HeroSectionContentStyled } from "./styles";

interface HeroSectionProps {
data: HeroSection
}
const HeroSectionComponent: React.FC<HeroSectionProps> = ({data}) => {
    return (
        <Container isScreen background={data.background ?? "none"}>
            <HeroSectionContentStyled>
                {data.image && <img src={data.image.url} alt={data.image.title ?? ""} />}
                <div>
                <h1>{data.title}</h1>
                {data.description?.json && documentToReactComponents(data.description.json)}
                {data.cta && <CTA data={data.cta} />}
                </div>
            </HeroSectionContentStyled>
        </Container>
    )
}

export default HeroSectionComponent