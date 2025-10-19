import { MouseEventHandler } from "react";
import { MobileToggleStyled } from "./styles";

interface HeaderMobileToggleProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}
const HeaderMobileToggle = ({ onClick }: HeaderMobileToggleProps) => {
  return (
    <MobileToggleStyled onClick={onClick}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.33301 6.66675H26.6663M5.33301 16.0001H26.6663M5.33301 25.3334H26.6663"
          stroke="black"
          stroke-width="2.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </MobileToggleStyled>
  );
};

export default HeaderMobileToggle;
