import { Background, BackgroundSplash } from "apps/website/src/types/shared";
import BackgroundSplashesComponent from "../splashes";
import { ContainerContentStyled, ContainerStyled } from "./styles";
interface ContainerProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  isScreen?: boolean;
  background?: Background;
  splashes?: BackgroundSplash[];
}
const Container: React.FC<ContainerProps> = ({
  children,
  style,
  isScreen,
  background,
  splashes,
}) => {
  return (
    <ContainerStyled
      style={style}
      $isScreen={isScreen}
      $background={background}
      data-screen-section={isScreen ? "true" : "false"}
    >
      <ContainerContentStyled>
        <BackgroundSplashesComponent data={splashes ?? []} />
        {children}
      </ContainerContentStyled>
    </ContainerStyled>
  );
};

export default Container;
