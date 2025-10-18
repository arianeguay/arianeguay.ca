import { Group } from "apps/website/src/types/shared";
import CTASection from "../CTASection";
import HeroSection from "../HeroSection";
import ItemsListSection from "../ItemsListSection";
import { GroupStyled } from "./styles";
interface GroupSectionProps {
  data: Group;
  isHero?: boolean;
}
const GroupSection: React.FC<GroupSectionProps> = ({ data }) => {
  const { elementsCollection, background, isScreen } = data;
  return (
    <GroupStyled
      $background={background}
      $isScreen={isScreen}
      data-screen-section={isScreen ? "true" : undefined}
    >
      {elementsCollection?.items.map((item, index) => {
        if (!item) return null;
        switch (item.__typename) {
          case "CtaSection":
            return <CTASection key={item.__typename + index} data={item} />;
          case "HeroSection":
            return <HeroSection key={item.__typename + index} data={item} />;
          case "ItemsList":
            return (
              <ItemsListSection key={item.__typename + index} data={item} />
            );
        }
      })}
    </GroupStyled>
  );
};

export default GroupSection;
