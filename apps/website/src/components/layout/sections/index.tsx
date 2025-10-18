import { SectionBlock } from "apps/website/src/types/blocks";
import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import ItemsListSection from "./ItemsListSection";
import GroupSection from "./Group";
interface SectionsProps {
  sections: SectionBlock[];
}

const Sections: React.FC<SectionsProps> = ({ sections }) => {
  return sections.map((s,index) => {
    if (!s) return null;
    console.log(s)
    switch (s.__typename) {
      case "CtaSection": 
        return <CTASection key={s.__typename+index} data={s} isHero={index===0} />;
      case "HeroSection":
        return <HeroSection key={s.__typename+index} data={s} isHero={index===0} />;
      case "ItemsList":
        return <ItemsListSection key={s.__typename+index} data={s} isHero={index===0} />;
      case "Group":
        return <GroupSection key={s.__typename+index} data={s} isHero={index===0} />;

    }
  });
};

export default Sections;
