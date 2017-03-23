import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const TripleDot = props => (
  <SVG
    viewBox="0 0 14 2"
    {...props}
  >
    <path
      d="M1 2c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm6 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm6 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
      fillRule="evenodd"
    />
  </SVG>
);

export default TripleDot;
