import { TagStyled } from "./styles";

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <TagStyled>{children}</TagStyled>;
};

export default Tag;
