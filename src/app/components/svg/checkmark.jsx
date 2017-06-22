import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const CheckmarkIcon = props => (
  <SVG
    viewBox="0 0 7 7"
    {...props}
  >
    <path
      d="M3.614 5.682L6.756.9c.148-.226.117-.578-.078-.773-.19-.19-.477-.166-.63.065L3.025 4.797 1.347 3.12c-.195-.195-.505-.188-.7.007-.19.19-.2.51-.007.7l2.134 2.135c.195.195.506.19.7-.007.076-.075.123-.172.14-.273z"
      fillRule="evenodd"
    />
  </SVG>
);

export default CheckmarkIcon;
