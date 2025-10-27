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
      <hr />
      {data.highlights && (
        <Typography variant="body2" element="div">
          {documentToReactComponents(data.highlights.json)}
        </Typography>
      )}
      <ExperienceSectionCardFooter>
        <Typography
          variant="body2"
          element="div"
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            marginBlockEnd: 0,
            lineHeight: "24px",
          }}
        >
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
            className="lucide lucide-map-pinned-icon lucide-map-pinned"
          >
            <path d="M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0" />
            <circle cx="12" cy="8" r="2" />
            <path d="M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712" />
          </svg>
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
