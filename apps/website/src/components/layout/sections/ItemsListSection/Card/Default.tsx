import { ListItem } from "apps/website/src/types/shared";
import { CardContainerStyled } from "./styles";
import Typography from "apps/website/src/components/common/typography";

interface DefaultCardProps extends ListItem {
  text: string;
  noWrap?: boolean;
}
const DefaultCard: React.FC<DefaultCardProps> = ({ text, noWrap }) => {
  return (
    <CardContainerStyled>
      <Typography element="p" variant="body2" noWrap={noWrap}>{text}</Typography>
    </CardContainerStyled>
  );
};

export default DefaultCard; 