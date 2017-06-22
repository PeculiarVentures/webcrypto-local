import styled, { keyframes } from 'styled-components';

const lineeee = keyframes`
  0% {
    stop-opacity: 0.3;
  }
  50% {
    stop-opacity: 0.7;
  }
  100% {
    stop-opacity: 0.3;
  }
`;

const linearPart = i => `
  stop-opacity: 0.3;
  animation: ${lineeee} 2s infinite;
  animation-delay: ${i * 0.1}s;
`;

export default function StyledAnimatedIcon(component, dataFilterName) {
  return styled(component)`
    display: block;
    width: 100%;
    [data-filter="${dataFilterName}"] {
      stop:nth-child(1) {
        ${linearPart(1)}
      }
      stop:nth-child(2) {
        ${linearPart(2)}
      }
      stop:nth-child(3) {
        ${linearPart(3)}
      }
      stop:nth-child(4) {
        ${linearPart(4)}
      }
      stop:nth-child(5) {
        ${linearPart(5)}
      }
      stop:nth-child(6) {
        ${linearPart(6)}
      }
      stop:nth-child(7) {
        ${linearPart(7)}
      }
      stop:nth-child(8) {
        ${linearPart(8)}
      }
      stop:nth-child(9) {
        ${linearPart(9)}
      }
      stop:nth-child(10) {
        ${linearPart(10)}
      }
      stop:nth-child(11) {
        ${linearPart(11)}
      }
    }
  `;
}
