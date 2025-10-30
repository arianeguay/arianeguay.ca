import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import theme from "apps/website/src/theme";
import "react-vertical-timeline-component/style.min.css";
import Button from "../../../common/button";
import { CtaAnchorStyled } from "../../../common/cta/styles";
import Tag from "../../../common/tag";
import TagGroup from "../../../common/tag/TagGroup";
import Typography from "../../../common/typography";
import Container from "../../container";
import ExperienceProfileSection from "./Section";
import { CompetencesGridStyled } from "./styles";
import { ExperienceSectionProps, ExperienceTimelineItem } from "./types";
import ExperienceSectionVerticalTimeline from "./VerticalTimeline";

const ExperienceSectionComponent: React.FC<ExperienceSectionProps> = ({
  data,
}) => {
  // Map Experience + Formation into VerticalTimeline events
  const expEvents = (data.enterpriseCollection?.items || []).map((e, i) => {
    const item: ExperienceTimelineItem = {
      id: `exp-${i}-${e.companyName}-${e.roleTitle}`,
      date: e.dateEnd || e.dateStart,
      startDate: e.dateStart,
      endDate: e.dateEnd || "",
      title: e.roleTitle,
      subtitle: e.companyName,
      color: theme.colors.brand.primary,
      tags: e.tagsCollection?.items,
      highlights:
        !!e.highlights && documentToReactComponents(e.highlights.json),
      description:
        !!e.description && documentToReactComponents(e.description.json),
      type: "experience",
    };
    return item;
  });

  const eduEvents = (data.formationsCollection?.items || []).map((f, i) => {
    const item: ExperienceTimelineItem = {
      id: `edu-${i}-${f.school}-${f.program}`,
      startDate: f.startDate,
      endDate: f.endDate,
      date: f.endDate || f.startDate,
      title: f.program,
      subtitle: f.school,
      color: theme.colors.ink2,
      description:
        f.description && documentToReactComponents(f.description.json),
      type: "formation",
    };
    return item;
  });

  const vtlEvents: ExperienceTimelineItem[] = [...expEvents, ...eduEvents].sort(
    (a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    },
  );

  return (
    <Container
      background={data.background || undefined}
      splashes={data.splashesCollection?.items || []}
    >
      <div>
        <Typography variant="h2" element="h2" style={{ textAlign: "center" }}>
          {data.title}
        </Typography>
        <ExperienceProfileSection
          title={data.enterpriseTitle}
          titlePosition="center"
        >
          <div>
            <ExperienceSectionVerticalTimeline items={vtlEvents} />
          </div>
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
        <ExperienceProfileSection
          title={data.cvFileTitle}
          asset={data.cvPreview}
        >
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
