import Typography from "apps/website/src/components/common/typography";
import { CardProps } from ".";
import { CardContainerStyled } from "./styles";
import CardWrapper from "./wrapper";

const CardTile: React.FC<CardProps> = (props) => {
  const { icon, title, text, noWrap } = props;
  return (
    <CardWrapper data={props}>
      <CardContainerStyled>
        {!!icon && (
          <img src={icon.url} alt={icon.title ?? ""} width={48} height={48} />
        )}
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
    </CardWrapper>
  );
};

export default CardTile;
