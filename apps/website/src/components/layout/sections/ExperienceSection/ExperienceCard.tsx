import theme from "apps/website/src/theme";
import "dayjs/locale/fr";
import Tag from "../../../common/tag";
import TagGroup from "../../../common/tag/TagGroup";
import Typography from "../../../common/typography";
import { ExperienceSectionCard, ExperienceSectionCardHeading } from "./styles";
import { ExperienceTimelineItem } from "./types";

interface JobExperienceCardProps {
  data: ExperienceTimelineItem;
}

const JobExperienceCard: React.FC<JobExperienceCardProps> = ({ data }) => {
  const { title, subtitle, description, highlights, tags } = data;
  return (
    <ExperienceSectionCard>
      <ExperienceSectionCardHeading>
        <Typography
          variant="body2"
          element="div"
          style={{ color: theme.colors.brand.primary }}
        >
          {subtitle}
        </Typography>
        <Typography variant="h5" element="h3">
          {title}
        </Typography>
      </ExperienceSectionCardHeading>
      {description && (
        <Typography variant="body1" element="div">
          {description}
        </Typography>
      )}

      {highlights && (
        <Typography
          variant="body2"
          element="div"
          style={{ marginBlock: "1rem" }}
        >
          {highlights}
        </Typography>
      )}
      {tags && (
        <TagGroup>
          {tags?.map((tag, index) => (
            <Tag key={index}>{tag.name}</Tag>
          ))}
        </TagGroup>
      )}
    </ExperienceSectionCard>
  );
};

export default JobExperienceCard;
