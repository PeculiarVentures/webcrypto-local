import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const ghostVerticalAlign = `
  &:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
    width: 0;
  }
`;

export const truncateText = `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
