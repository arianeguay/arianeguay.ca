import { SiteSocial } from "apps/website/src/types/settings";
import EmailIcon from "./social-icons/email";
import GithubIcon from "./social-icons/github";
import LinkedinIcon from "./social-icons/linkedin";
import { SocialsStyled } from "./styles";
interface FooterSocialsProps {
  socials: SiteSocial[];
}
const SocialIconSize = 24;
const SocialIcon = ({ social }: { social: SiteSocial }) => {
  switch (social.platform) {
    case "LinkedIn":
      return <LinkedinIcon size={SocialIconSize} />;
    case "GitHub":
      return <GithubIcon size={SocialIconSize} />;
    case "Email":
      return <EmailIcon size={SocialIconSize} />;
    default:
      return null;
  }
};
const FooterSocials = ({ socials }: FooterSocialsProps) => {
  return (
    <SocialsStyled>
      {socials.map((social) => (
        <a
          key={social.platform}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialIcon social={social} />
        </a>
      ))}
    </SocialsStyled>
  );
};
export default FooterSocials;
