import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { ExperienceSection } from "apps/website/src/types/shared";
import Typography from "../../../common/typography";
import Container from "../../container";

interface ExperienceSectionProps {
  data: ExperienceSection;
  isHero?: boolean;
}
const ExperienceSectionComponent: React.FC<ExperienceSectionProps> = ({
  data,
  isHero,
}) => {
  return (
    <Container>
      <div>
        <Typography variant="h2" element="h2">
          {data.title}
        </Typography>
        <div>
          <Typography variant="h3" element="h3">
            {data.enterpriseTitle}
          </Typography>
          {data.enterpriseCollection?.items.map((enterprise, index) => (
            <div key={index}>
              <Typography variant="h4" element="h4">
                {enterprise.companyName}
              </Typography>
              {enterprise.description && (
                <Typography variant="body1" element="p">
                  {documentToReactComponents(enterprise.description.json)}
                </Typography>
              )}
            </div>
          ))}
        </div>
        <div>
          <Typography variant="h3" element="h3">
            {data.formationsTitle}
          </Typography>
          {data.formationsCollection?.items.map((formation, index) => (
            <div key={index}>
              <Typography variant="h4" element="h4">
                {formation.school}
              </Typography>
              {formation.description && (
                <Typography variant="body1" element="p">
                  {documentToReactComponents(formation.description.json)}
                </Typography>
              )}
            </div>
          ))}
        </div>
        <div>
          <Typography variant="h3" element="h3">
            {data.competencesTitle}
          </Typography>
          {data.competencesCollection?.items.map((competence, index) => (
            <div key={index}>
              <Typography variant="h4" element="h4">
                {competence.title}
              </Typography>
              {competence.tagsCollection?.items.map((tag, index) => (
                <Typography variant="body1" element="p" key={index}>
                  {tag.name}
                </Typography>
              ))}
            </div>
          ))}
        </div>
        <div>
          <Typography variant="h3" element="h3">
            {data.cvFileTitle}
          </Typography>
          <a href={data.cvFile?.url} download target="_blank">
            {data.cvFileCta}
          </a>
          <Typography variant="body1" element="p">
            {data.cvFileDescription}
          </Typography>
        </div>
      </div>
    </Container>
  );
};

export default ExperienceSectionComponent;
