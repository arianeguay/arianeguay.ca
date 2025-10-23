import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { WorkItem } from "apps/website/src/types/work";
import Typography from "../../../common/typography";
interface ProjectSingleContentProps {
  data: WorkItem;
}
const ProjectSingleContent: React.FC<ProjectSingleContentProps> = ({
  data,
}) => {
  return (
    <div>
      {!!data.overview && (
        <Typography element="div" variant="body1">
          {!!data.overview && documentToReactComponents(data.overview.json)}
        </Typography>
      )}
      {!!data.process && (
        <Typography element="div" variant="body1">
          {data.process.map((item) => (
            <div key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </Typography>
      )}
      {data.testimonial && (
        <Typography element="div" variant="body1">
          {data.testimonial.quote}
          {data.testimonial.roleOrCompany}
          {data.testimonial.author}
        </Typography>
      )}

      {!!data.summary && (
        <Typography element="div" variant="body1">
          {documentToReactComponents(data.summary.json)}
        </Typography>
      )}
      {!!data.problemStatement && (
        <Typography element="div" variant="body1">
          {data.problemStatement.map((item) => (
            <div key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          ))}
        </Typography>
      )}
      {data.highlights && (
        <Typography element="div" variant="body1">
          {data.highlights.map((item) => (
            <div key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.inlineBottomText}</p>
            </div>
          ))}
        </Typography>
      )}
      {data.metrics && (
        <Typography element="div" variant="body1">
          {data.metrics.map((item) => (
            <div key={item.description}>
              <h2>{item.description}</h2>
              <p>{item.value}</p>
            </div>
          ))}
        </Typography>
      )}
    </div>
  );
};

export default ProjectSingleContent;
