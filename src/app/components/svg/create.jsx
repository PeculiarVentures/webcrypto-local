import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const CreateIcon = props => (
  <SVG
    viewBox="0 0 19 19"
    {...props}
  >
    <g stroke="#0ABE55" fill="none" fillRule="evenodd">
      <circle cx="9.5" cy="9.5" r="9" />
      <path d="M9.5 5.5v8M5.5 9.5h8" strokeLinecap="square" />
    </g>
  </SVG>
);

export default CreateIcon;
