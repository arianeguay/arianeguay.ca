import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import theme from "apps/website/src/theme";
import { Enterprise } from "apps/website/src/types/shared";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import Tag from "../../../common/tag";
import TagGroup from "../../../common/tag/TagGroup";
import Typography from "../../../common/typography";
import {
  ExperienceSectionCard,
  ExperienceSectionCardFooter,
  ExperienceSectionCardHeader,
  ExperienceSectionCardHeading,
} from "./styles";

interface JobExperienceCardProps {
  data: Enterprise;
}

const formatJobDate = (date: string, locale: string = "fr") => {
  return dayjs(date).locale(locale).format("MMM YYYY");
};

const JobExperienceCard: React.FC<JobExperienceCardProps> = ({ data }) => {
  return (
    <ExperienceSectionCard>
      <ExperienceSectionCardHeader>
        <ExperienceSectionCardHeading>
          <Typography
            variant="body2"
            element="div"
            style={{ color: theme.colors.brand.primary }}
          >
            {data.companyName}
          </Typography>
          <Typography variant="h4" element="h4">
            {data.roleTitle}
          </Typography>
        </ExperienceSectionCardHeading>
        <Typography
          variant="body2"
          element="div"
          style={{ width: "fit-content", color: theme.colors.ink2 }}
        >
          {formatJobDate(data.dateStart, "fr")} -{" "}
          {data.dateEnd ? formatJobDate(data.dateEnd, "fr") : "Present"}
        </Typography>
      </ExperienceSectionCardHeader>
      {data.description && (
        <Typography variant="body1" element="div">
          {documentToReactComponents(data.description.json)}
        </Typography>
      )}
      {data.highlights && (
        <Typography variant="body2" element="div">
          {documentToReactComponents(data.highlights.json)}
        </Typography>
      )}
      <ExperienceSectionCardFooter>
        <Typography variant="body2" element="div">
          {data.location}
        </Typography>
        <TagGroup>
          {data.tagsCollection?.items.map((tag, index) => (
            <Tag key={index}>{tag.name}</Tag>
          ))}
        </TagGroup>
      </ExperienceSectionCardFooter>
    </ExperienceSectionCard>
  );
};

export default JobExperienceCard;
