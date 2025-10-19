import { CustomTheme } from "apps/website/src/theme";
import { LinkItemVariant } from "apps/website/src/types/shared";
import { MouseEventHandler } from "react";
import { ButtonStyled } from "./styles";

export type ButtonSize = keyof CustomTheme["button"]["sizes"];
export interface ButtonProps {
  variant?: LinkItemVariant;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  size?: ButtonSize;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  disabled,
  type,
  size,
  style,
  className,
  id,
  onClick,
}) => {
  return (
    <ButtonStyled
      $variant={variant}
      disabled={disabled}
      type={type}
      $size={size}
      style={style}
      className={className}
      id={id}
      onClick={onClick}
    >
      {children}
    </ButtonStyled>
  );
};

export default Button;
