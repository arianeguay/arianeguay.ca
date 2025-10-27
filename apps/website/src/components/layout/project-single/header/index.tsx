import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { WorkItem } from "apps/website/src/types/work";
import Typography from "../../../common/typography";
interface ProjectSingleHeaderProps {
  data: WorkItem;
}
const ProjectSingleHeader: React.FC<ProjectSingleHeaderProps> = ({ data }) => {
  return (
    <div>
      {data.cover && (
        <img
          src={data.cover.url}
          alt={data.cover.title ?? ""}
          style={{ maxWidth: "60%", margin: "auto" }}
        />
      )}
      <Typography element="p" variant="body1" style={{ textAlign: "center" }}>
        {[data.badge, data.projectMeta?.company].filter(Boolean).join(" • ")}
      </Typography>
      <Typography element="h1" variant="h1" style={{ textAlign: "center" }}>
        {data.title}
      </Typography>
      {!!data.subtitle && (
        <Typography element="p" variant="body1" style={{ textAlign: "center" }}>
          {data.subtitle}
        </Typography>
      )}
      {!!data.summary && (
        <Typography element="p" variant="body1" style={{ textAlign: "center" }}>
          {documentToReactComponents(data.summary.json)}
        </Typography>
      )}
      {data.projectMeta && (
        <div>
          <p>{data.projectMeta.period}</p>
          <p>{data.projectMeta.location}</p>
          <p>{data.projectMeta.role}</p>
          <p>
            {data.projectMeta.stackCollection?.items
              ?.map((item) => item.name)
              .join(", ")}
          </p>
          {data.projectMeta.linksCollection?.items && (
            <div>
              {data.projectMeta.linksCollection?.items?.map((item) => (
                <p key={item.label}>{item.label}</p>
              ))}
            </div>
          )}
          {data.projectMeta.sector}
        </div>
      )}
    </div>
  );
};

export default ProjectSingleHeader;
