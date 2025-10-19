import styled from "styled-components";

export const DrawerStyled = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  z-index: 100;
  transition: right ${({ theme }) => theme.motion.normal};
  ${({ $isOpen }) => ($isOpen ? "right: 0" : "right: -100%")};
`;

export const DrawerContentStyled = styled.div`
  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
`;

export const MobileToggleStyled = styled.button`
  cursor: pointer;
  appearance: none;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink2};
  padding:0
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: background ${({ theme }) => theme.motion.fast};
  font-size: 32px;
  line-height: 1;

  &:hover {
    background: rgba(17, 17, 20, 0.06);
  }
  &:focus {
    outline: ${({ theme }) => theme.focus.ringWidth} solid
      ${({ theme }) => theme.focus.ringColor};
    outline-offset: ${({ theme }) => theme.focus.ringOffset};
  }
`;
export const DrawerHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
  align-items: center;

  height: var(--header-height);
  border-bottom: 1px solid rgba(17, 17, 20, 0.26);
  padding-inline: ${({ theme }) => theme.spacing.xl};
  padding-block: ${({ theme }) => theme.spacing.xs};
`;

export const MobileNavItemStyled = styled.a<{ $active: boolean }>`
  display: block;
  padding: 16px;
  color: ${({ theme }) => theme.colors.ink1};
  text-decoration: none;
  transition: all ${({ theme }) => theme.motion.fast};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  font-size: ${({ theme }) => theme.typography.body1.size};
  font-family: ${({ theme }) =>
    theme.font.family[theme.typography.body1.family]};
  ${({ $active }) => ($active ? "color: #000" : "")};
  &:not(:last-child) {
    border-bottom: 1px solid rgba(17, 17, 20, 0.06);
  }

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryAlt};
    color: ${({ theme }) => theme.colors.inkLight};
  }
`;
