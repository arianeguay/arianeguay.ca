import { SiteSocial } from "apps/website/src/types/settings";
import { FooterStyled } from "./styles";
interface FooterProps {
  copyright: string;
  socials: SiteSocial[];
}
const Footer: React.FC<FooterProps> = ({
  copyright,
  socials,
}: FooterProps) => {
  return (
    <FooterStyled>
      <>
        <p>{copyright}</p>
        <div>
          {socials.map((social) => (
            <a key={social.platform} href={social.url}>
              {social.platform}
            </a>
          ))}
        </div>
      </>
    </FooterStyled>
  );
};
export default Footer;
