import { Group } from "apps/website/src/types/shared";
import CTASection from "../CTASection";
import ItemsListSection from "../ItemsListSection";
import { GroupStyled } from "./styles";
interface GroupSectionProps {
  data: Group;
  isHero?: boolean;
}
const GroupSection: React.FC<GroupSectionProps> = ({ data }) => {
  const { elementsCollection, background, isScreen } = data;
  // Determine if this group should use snap scrolling (customize based on your needs)
  // For this example, we'll use a naming convention to identify snap sections

  return (
    <GroupStyled
      $background={background}
      $isScreen={isScreen}
      data-screen-section={isScreen ? "snap" : undefined}
    >
      {elementsCollection?.items.map((item, index) => {
        if (!item) return null;
        switch (item.__typename) {
          case "CtaSection":
            return <CTASection key={item.__typename + index} data={item} />;
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
