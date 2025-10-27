import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Typography from "apps/website/src/components/common/typography";
import theme from "apps/website/src/theme";
import { WorkItem } from "apps/website/src/types/work";
import WorkItemCardStyled from "./styles";

const WorkItemCard: React.FC<WorkItem> = ({ ...props }) => {
  return (
    <WorkItemCardStyled href={props.slug}>
      <div>
        <Typography
          element="div"
          variant="overline"
          style={{ color: theme.colors.brand.primary }}
        >
          {props.projectMeta?.company}
        </Typography>
        <Typography element="div" variant="subtitle1">
          {props.title}
        </Typography>
        <Typography element="div" variant="body1">
          {props.projectMeta?.role}
        </Typography>
      </div>

      {!!props.summary?.json && (
        <Typography element="div" variant="body1">
          {documentToReactComponents(props.summary?.json)}
        </Typography>
      )}
    </WorkItemCardStyled>
  );
};

export default WorkItemCard;
