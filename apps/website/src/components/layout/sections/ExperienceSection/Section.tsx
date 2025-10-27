import { CFMaybe } from "apps/website/src/cms/cf-graphql";
import Typography from "../../../common/typography";
import { ExperienceProfileSectionStyled } from "./styles";

interface ExperienceProfileSectionProps {
  title: CFMaybe<string> | undefined;
  children: React.ReactNode;
}
const ExperienceProfileSection: React.FC<ExperienceProfileSectionProps> = ({
  title,
  children,
}) => {
  return (
    <ExperienceProfileSectionStyled>
      {title && (
        <>
          <Typography variant="h3" element="h3">
            {title}
          </Typography>
          <hr />
        </>
      )}
      {children}
    </ExperienceProfileSectionStyled>
  );
};

export default ExperienceProfileSection;
