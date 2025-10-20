import React from "react";
import Typography from "../typography";
import { TagGroupContainerStyled, TagGroupStyled } from "./styles";

const TagGroup: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  if (!!title) {
    return (
      <TagGroupContainerStyled>
        {title && (
          <Typography variant="subtitle2" element="div">
            {title}
          </Typography>
        )}
        <TagGroupStyled>{children}</TagGroupStyled>
      </TagGroupContainerStyled>
    );
  }
  return <TagGroupStyled>{children}</TagGroupStyled>;
};

export default TagGroup;
