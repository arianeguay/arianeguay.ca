import styled from "styled-components";

export const DropdownMenu = styled.div`
  position: relative;
`;
export const DropdownMenuTrigger = styled.div`
  cursor: pointer;
`;
export const DropdownMenuContent = styled.div<{ $open: boolean }>`
  background-color: #fff;
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: absolute;
  z-index: 100;
  left: 0;
  top: calc(100% + ${({ theme }) => theme.spacing.md});
  width: 260px;
  max-height: ${({ $open }) => ($open ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-out;
`;
export const DropdownMenuList = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;
export const DropdownMenuItem = styled.div`
  cursor: pointer;
  padding-inline: ${({ theme }) => theme.spacing.lg};
  padding-block: ${({ theme }) => theme.spacing.xs};
  &:hover {
    background-color: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.inkLight};
  }
`;
