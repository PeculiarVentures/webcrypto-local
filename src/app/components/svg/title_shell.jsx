import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const TitleShellIcon = props => (
  <SVG
    viewBox="0 0 200 22"
    {...props}
  >
    <defs>
      <linearGradient id="t_gradient" data-filter="t_gradient" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="10%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="20%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="30%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="40%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="60%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="80%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="90%" stopColor="#97A1A9" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#97A1A9" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <rect
      width="200"
      height="22"
      rx="1"
      opacity="0.3"
      clipRule="evenodd"
      fill="url(#t_gradient)"
    />
  </SVG>
);

export default TitleShellIcon;
