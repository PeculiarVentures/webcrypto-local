import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
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

export const clear = `
  &:after {
    content: '';
    clear: both;
    display: table;
  }
`;
