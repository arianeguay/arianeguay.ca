import Typography from "apps/website/src/components/common/typography";
import { CardProps } from ".";
import { RowContainerStyled } from "./styles";
import CardWrapper from "./wrapper";

const CitationTile: React.FC<CardProps> = (props) => {
  const { title, text, noWrap } = props;
  return (
    <CardWrapper data={props}>
      <RowContainerStyled>
        <div>
          {!!title && (
            <Typography
              element="p"
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
      </RowContainerStyled>
    </CardWrapper>
  );
};

export default CitationTile;
