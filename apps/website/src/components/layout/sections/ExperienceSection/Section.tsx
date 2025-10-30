import { CFMaybe } from "apps/website/src/cms/cf-graphql";
import theme from "apps/website/src/theme";
import { CfAsset } from "apps/website/src/types/asset";
import Typography from "../../../common/typography";
import { ExperienceProfileSectionStyled } from "./styles";

interface ExperienceProfileSectionProps {
  title: CFMaybe<string> | undefined;
  children: React.ReactNode;
  titlePosition?: "left" | "right" | "center";
  asset?: CFMaybe<CfAsset>;
}
const ExperienceProfileSection: React.FC<ExperienceProfileSectionProps> = ({
  title,
  children,
  titlePosition = "left",
  asset,
}) => {
  return (
    <ExperienceProfileSectionStyled>
      {asset && (
        <img
          style={{
            borderRadius: 4,
            boxShadow: theme.shadows.md,
            border: "1px solid " + theme.colors.border,
          }}
          src={asset.url}
          alt={asset.title || ""}
        />
      )}
      <div style={{ width: "100%", height: "fit-content" }}>
        {title && (
          <>
            <Typography
              variant="h3"
              element="h3"
              style={{ textAlign: titlePosition }}
            >
              {title}
            </Typography>
            <hr />
          </>
        )}
        {children}
      </div>
    </ExperienceProfileSectionStyled>
  );
};

export default ExperienceProfileSection;
