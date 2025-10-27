"use client";
import Typography from "apps/website/src/components/common/typography";
import { useState } from "react";
import { CardProps } from ".";
import {
  FAQContainerStyled,
  FAQContentStyled,
  FAQHeaderStyled,
  FaqHeadingStyled,
} from "./styles";
import CardWrapper from "./wrapper";

const FaqTile: React.FC<CardProps> = (props) => {
  const { icon, title, text, noWrap } = props;
  const [isOpened, setIsOpened] = useState(false);
  const handleToggle = () => {
    setIsOpened(!isOpened);
  };
  return (
    <CardWrapper data={props}>
      <FAQContainerStyled>
        <FAQHeaderStyled onClick={handleToggle}>
          <FaqHeadingStyled>
            {!!icon && <img src={icon.url} alt={icon.title ?? ""} />}
            {!!title && (
              <Typography element="h3" variant="h6" noWrap={noWrap}>
                {title}
              </Typography>
            )}
          </FaqHeadingStyled>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transition: "all 0.3s ease-in-out",
              transform: !isOpened ? "rotate(-180deg)" : "rotate(0deg)",
            }}
          >
            <path
              d="M8 12L16 20L24 12"
              stroke="#3A3A44"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </FAQHeaderStyled>
        <FAQContentStyled isOpened={isOpened}>
          <Typography element="p" variant="body2" noWrap={noWrap}>
            {text}
          </Typography>
        </FAQContentStyled>
      </FAQContainerStyled>
    </CardWrapper>
  );
};

export default FaqTile;
