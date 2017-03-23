import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const ArrowBackIcon = props => (
  <SVG
    viewBox="0 0 11 6"
    {...props}
  >
    <path
      d="M2.092 2.546h7.884c.28 0 .51.232.51.5 0 .277-.228.5-.51.5h-7.82L3.44 4.828c.192.192.183.51-.006.7-.196.196-.506.202-.7.007L.596 3.4c-.1-.1-.146-.234-.14-.367-.018-.144.028-.293.14-.405L2.73.493c.193-.19.512-.183.702.007.195.195.2.506.006.7L2.092 2.546z"
      fillRule="evenodd"
    />
  </SVG>
);

export default ArrowBackIcon;
