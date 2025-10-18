import { keyframes } from "styled-components";
import styled from "styled-components";

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scroll = keyframes`
0% {
    transform: translateX(0%);
}

100% {
    transform: translateX(-50%);
}
`;
export const ScrollerRow = styled.div<{$size:number}>`
  display: flex;
  gap: 16px;
  width: fit-content;
  animation: ${({$size}) => ($size??3) * 2}s linear 0s infinite normal none running ${scroll};
`;

export const ScrollerContainer = styled.div`
  width: 100%;
  position: relative;
  animation: 0.6s linear 0s 1 normal none running ${fadein};
  padding-block: 4px;
  display: flex;

  height:fit-content;
`;
