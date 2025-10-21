import Typography from "apps/website/src/components/common/typography";
import { CardProps } from ".";
import { CardContainerStyled } from "./styles";

const CardTile: React.FC<CardProps> = ({ text, noWrap, title, icon }) => {
  return (
    <CardContainerStyled>
      {!!icon && <img src={icon.url} alt={icon.title ?? ""} />}
      <div>
        {!!title && (
          <Typography
            element="h3"
            variant="h5"
            noWrap={noWrap}
            style={{ marginBlockEnd: "0.8rem" }}
          >
            {title}
          </Typography>
        )}
        <Typography element="p" variant="body2" noWrap={noWrap}>
          {text}
        </Typography>
      </div>
    </CardContainerStyled>
  );
};

export default CardTile;
