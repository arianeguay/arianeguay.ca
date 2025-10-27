import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Project } from "apps/website/src/types/shared";
import Image from "next/image";
import Tag from "../../../common/tag";
import TagGroup from "../../../common/tag/TagGroup";
import Typography from "../../../common/typography";
import Container from "../../container";

interface ProjectSectionProps {
  data: Project;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ data }) => {
  return (
    <>
      <Container
        background="gradient5"
        style={{ textAlign: "center", paddingBlockStart: 78 }}
      >
        {!!data.cover && (
          <Image src={data.cover.url} alt={data.cover.title || ""} />
        )}
        {!!data.company && (
          <Typography element="div" variant="h4">
            {data.company}
          </Typography>
        )}
        {!!data.title && (
          <Typography element="h1" variant="h1">
            {data.title}
          </Typography>
        )}

        {!!data.summary && (
          <Typography element="p" variant="body1">
            {data.summary}
          </Typography>
        )}
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          {!!data.category && (
            <Typography element="p" variant="body1">
              {data.category}
            </Typography>
          )}
          {(!!data.startDate || data.endDate) && (
            <Typography element="p" variant="body1">
              {data.ongoing
                ? "En cours"
                : [data.startDate, data.endDate].filter(Boolean).join(" - ")}
            </Typography>
          )}
        </div>
      </Container>
      <Container background="gradient6">
        <div style={{ width: "100%" }}>
          {!!data.caseBody && documentToReactComponents(data.caseBody.json)}
        </div>

        {!!data.highlights && (
          <div style={{ width: "100%" }}>
            {data.highlights.map((h) => (
              <Typography element="p" variant="body1">
                {h}
              </Typography>
            ))}
          </div>
        )}
        {!!data.gallery && (
          <div style={{ width: "100%", display: "flex", gap: 16 }}>
            {data.gallery.map((g) => (
              <Image src={g.url} alt={g.title || ""} />
            ))}
          </div>
        )}
        {!!data.liveUrl && (
          <Typography element="p" variant="body1">
            Live : <a href={data.liveUrl}>{data.liveUrl}</a>
          </Typography>
        )}
        {!!data.repoUrl && (
          <Typography element="p" variant="body1">
            Repo : <a href={data.repoUrl}>{data.repoUrl}</a>
          </Typography>
        )}
        {data.confidentialityNote && (
          <Typography element="p" variant="body1">
            {data.confidentialityNote}
          </Typography>
        )}
        {data.tagsCollection && (
          <div style={{ width: "100%" }}>
            {data.tagsCollection.items.map((t) => (
              <TagGroup key={t.title} title={t.title}>
                {t.tagsCollection?.items.map((tag) => (
                  <Tag key={tag.name}>{tag.name}</Tag>
                ))}
              </TagGroup>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default ProjectSection;
