import { SiteSocial } from "apps/website/src/types/settings";
import FooterSocials from "./socials";
import { FooterStyled } from "./styles";
interface FooterProps {
  copyright: string;
  socials: SiteSocial[];
}
const Footer: React.FC<FooterProps> = ({ copyright, socials }: FooterProps) => {
  return (
    <FooterStyled>
      <>
        <p>{copyright}</p>
        <FooterSocials socials={socials} />
      </>
    </FooterStyled>
  );
};
export default Footer;
