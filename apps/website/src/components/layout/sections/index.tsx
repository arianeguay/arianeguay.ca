import { SectionBlock } from "apps/website/src/types/blocks";
import CTASection from "./CTASection";
import ExperienceSectionComponent from "./ExperienceSection";
import GroupSection from "./Group";
import ItemsListSection from "./ItemsListSection";
import ProjectSection from "./ProjectSection";
interface SectionsProps {
  sections: SectionBlock[];
}

const Sections: React.FC<SectionsProps> = ({ sections }) => {
  return sections.map((s, index) => {
    if (!s) return null;
    switch (s.__typename) {
      case "CtaSection":
        return (
          <CTASection
            key={s.__typename + index}
            data={s}
            isHero={index === 0}
          />
        );
      case "ItemsList":
        return (
          <ItemsListSection
            key={s.__typename + index}
            data={s}
            isHero={index === 0}
          />
        );
      case "Group":
        return (
          <GroupSection
            key={s.__typename + index}
            data={s}
            isHero={index === 0}
          />
        );
      case "ExperienceSection":
        return (
          <ExperienceSectionComponent key={s.__typename + index} data={s} />
        );
      case "Project":
        return <ProjectSection key={s.__typename + index} data={s} />;
    }
  });
};

export default Sections;
