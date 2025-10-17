import { ListItem } from "apps/website/src/types/shared";
import { CardContainerStyled } from "./styles";

const CitationCard: React.FC<ListItem> = ({ text }) => {
  return (
    <CardContainerStyled>
      <h3>{text}</h3>
    </CardContainerStyled>
  );
};

export default CitationCard;