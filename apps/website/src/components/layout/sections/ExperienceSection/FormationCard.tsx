import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import theme from "apps/website/src/theme";
import { Formation } from "apps/website/src/types/shared";
import Typography from "../../../common/typography";
import { ExperienceSectionCard, ExperienceSectionCardHeader } from "./styles";

const FormationCard: React.FC<{ data: Formation }> = ({ data }) => {
  return (
    <ExperienceSectionCard>
      <ExperienceSectionCardHeader>
        <div>
          <Typography
            variant="body2"
            element="div"
            style={{ color: theme.colors.brand.primary }}
          >
            {data.school}
          </Typography>
          <Typography variant="h4" element="h4">
            {data.program}
          </Typography>
        </div>
        <Typography
          variant="body2"
          element="div"
          style={{ color: theme.colors.ink2 }}
        >
          {data.years}
        </Typography>
      </ExperienceSectionCardHeader>
      <Typography variant="body1" element="div">
        {data.description && documentToReactComponents(data.description.json)}
      </Typography>
    </ExperienceSectionCard>
  );
};
export default FormationCard;
