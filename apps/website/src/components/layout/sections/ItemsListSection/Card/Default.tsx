import { ListItem } from "apps/website/src/types/shared";
import { CardContainerStyled } from "./styles";
import Typography from "apps/website/src/components/common/typography";

interface DefaultCardProps extends ListItem {
  text: string;
  noWrap?: boolean;
}
const DefaultCard: React.FC<DefaultCardProps> = ({
  text,
  noWrap,
  title,
  icon,
  variant,
}) => {
  return (
    <CardContainerStyled $variant={variant ?? "row"}>
      {!!icon && <img src={icon.url} alt={icon.title ?? ""} />}
      <div>
        {!!title && (
          <Typography element="p" variant="h5" noWrap={noWrap}>
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

export default DefaultCard;
