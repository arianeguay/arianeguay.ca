import Typography from "apps/website/src/components/common/typography";
import { CardProps } from ".";
import { RowContainerStyled } from "./styles";

const RowTile: React.FC<CardProps> = ({
  text,
  noWrap,
  title,
  icon,
  textAlign,
}) => {
  return (
    <RowContainerStyled>
      {!!icon && <img src={icon.url} alt={icon.title ?? ""} />}
      <div>
        {!!title ? (
          <>
            <Typography
              element="p"
              variant="h5"
              noWrap={noWrap}
              textAlign={textAlign}
              style={{ marginBlockEnd: "0.8rem" }}
            >
              {title}
            </Typography>
            <Typography
              element="p"
              variant="body2"
              noWrap={noWrap}
              textAlign={textAlign}
            >
              {text}
            </Typography>
          </>
        ) : (
          <Typography
            element="p"
            variant="subtitle1"
            noWrap={noWrap}
            textAlign={textAlign}
          >
            {text}
          </Typography>
        )}
      </div>
    </RowContainerStyled>
  );
};

export default RowTile;
