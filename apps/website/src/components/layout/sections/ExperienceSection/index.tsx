import { ExperienceSection } from "apps/website/src/types/shared";
import Button from "../../../common/button";
import Tag from "../../../common/tag";
import TagGroup from "../../../common/tag/TagGroup";
import Typography from "../../../common/typography";
import Container from "../../container";
import FormationCard from "./FormationCard";
import JobExperienceCard from "./JobExperienceCard";
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
        <div>
          <Typography
            variant="h3"
            element="h3"
            style={{ marginBlockEnd: "1rem" }}
          >
            {data.enterpriseTitle}
          </Typography>
          {data.enterpriseCollection?.items.map((enterprise, index) => (
            <JobExperienceCard key={index} data={enterprise} />
          ))}
        </div>
        <div>
          <Typography
            variant="h3"
            element="h3"
            style={{ marginBlockEnd: "1rem" }}
          >
            {data.formationsTitle}
          </Typography>
          {data.formationsCollection?.items.map((formation, index) => (
            <FormationCard key={index} data={formation} />
          ))}
        </div>
        <div>
          <Typography
            variant="h3"
            element="h3"
            style={{ marginBlockEnd: "1rem" }}
          >
            {data.competencesTitle}
          </Typography>
          <CompetencesGridStyled>
            {data.competencesCollection?.items.map((competence, index) => (
              <TagGroup title={competence.title} key={index}>
                {competence.tagsCollection?.items.map((tag, index) => (
                  <Tag key={index}>{tag.name}</Tag>
                ))}
              </TagGroup>
            ))}
          </CompetencesGridStyled>
        </div>
        <div>
          <Typography
            variant="h3"
            element="h3"
            style={{ marginBlockEnd: "1rem" }}
          >
            {data.cvFileTitle}
          </Typography>
          <Typography
            variant="body1"
            element="p"
            style={{ marginBlockEnd: "1rem", marginBlockStart: "0.5rem" }}
          >
            {data.cvFileDescription}
          </Typography>
          <a href={data.cvFile?.url} download target="_blank">
            <Button variant="primary">{data.cvFileCta}</Button>
          </a>
        </div>
      </div>
    </Container>
  );
};

export default ExperienceSectionComponent;
