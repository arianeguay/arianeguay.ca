import { WorkItem } from "apps/website/src/types/work";
import Container from "../container";
import CTASectionComponent from "../sections/CTASection";
import ProjectSingleContent from "./content";
import ProjectSingleHeader from "./header";
interface ProjectSingleProps {
  data: WorkItem;
}
const ProjectSingle: React.FC<ProjectSingleProps> = ({
  data,
}: ProjectSingleProps) => {
  return (
    <>
      <Container background="gradient6">
        <ProjectSingleHeader data={data} />
        <ProjectSingleContent data={data} />
      </Container>
      {!!data.ctaSection && <CTASectionComponent data={data.ctaSection} />}
    </>
  );
};

export default ProjectSingle;
