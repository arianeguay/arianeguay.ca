import { ExperienceSection } from "apps/website/src/types/shared";
import Button from "../../../common/button";
import { CtaAnchorStyled } from "../../../common/cta/styles";
import Tag from "../../../common/tag";
import TagGroup from "../../../common/tag/TagGroup";
import Typography from "../../../common/typography";
import Container from "../../container";
import FormationCard from "./FormationCard";
import JobExperienceCard from "./JobExperienceCard";
import ExperienceProfileSection from "./Section";
import { CompetencesGridStyled } from "./styles";
interface ExperienceSectionProps {
  data: ExperienceSection;
}
const ExperienceSectionComponent: React.FC<ExperienceSectionProps> = ({
  data,
}) => {
  return (
    <Container background={data.background || undefined}>
      <div>
        <Typography variant="h2" element="h2" style={{ textAlign: "center" }}>
          {data.title}
        </Typography>
        <ExperienceProfileSection title={data.enterpriseTitle}>
          {data.enterpriseCollection?.items.map((enterprise, index) => (
            <JobExperienceCard key={index} data={enterprise} />
          ))}
        </ExperienceProfileSection>
        <ExperienceProfileSection title={data.formationsTitle}>
          {data.formationsCollection?.items.map((formation, index) => (
            <FormationCard key={index} data={formation} />
          ))}
        </ExperienceProfileSection>
        <ExperienceProfileSection title={data.competencesTitle}>
          <CompetencesGridStyled>
            {data.competencesCollection?.items.map((competence, index) => (
              <TagGroup title={competence.title} key={index}>
                {competence.tagsCollection?.items.map((tag, index) => (
                  <Tag key={index}>{tag.name}</Tag>
                ))}
              </TagGroup>
            ))}
          </CompetencesGridStyled>
        </ExperienceProfileSection>
        <ExperienceProfileSection title={data.cvFileTitle}>
          <Typography
            variant="h6"
            element="div"
            style={{ marginBlockEnd: "1rem" }}
          >
            {data.cvFileDescription}
          </Typography>
          <CtaAnchorStyled href={data.cvFile?.url} download target="_blank">
            <Button variant="primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-download-icon lucide-download"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              {data.cvFileCta}
            </Button>
          </CtaAnchorStyled>
        </ExperienceProfileSection>
      </div>
    </Container>
  );
};

export default ExperienceSectionComponent;
