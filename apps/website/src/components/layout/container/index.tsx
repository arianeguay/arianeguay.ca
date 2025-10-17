import { Background } from "apps/website/src/types/shared";
import { ContainerContentStyled, ContainerStyled } from "./styles";
interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  isScreen?: boolean;
  background?: Background;
}
const Container: React.FC<ContainerProps> = ({
  children,
  style,
  isScreen,
  background,
}) => {
  return (
    <ContainerStyled
      style={style}
      $isScreen={isScreen}
      $background={background}
      data-screen-section={isScreen ? "true" : "false"}
    >
      <ContainerContentStyled>{children}</ContainerContentStyled>
    </ContainerStyled>
  );
};

export default Container;
