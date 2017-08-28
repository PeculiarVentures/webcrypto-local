import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const ImportIcon = props => (
  <SVG
    viewBox="0 0 17 17"
    {...props}
  >
    <path
      d="M8.337.0272C8.388.0096 8.443 0 8.5 0c.0802 0 .156.019.223.0524.0474.0235.092.055.1315.0945l3.213 3.213c.1952.1952.1952.5117 0 .707-.1953.1953-.512.1953-.7072 0L9 1.7067V9.5c0 .276-.224.5-.5.5S8 9.776 8 9.5V1.7064L5.6396 4.0668c-.1953.1953-.512.1953-.707 0-.1954-.1952-.1954-.5118 0-.707L8.1453.1467c.056-.056.1216-.0957.1916-.1196zM1 10h15c.5523 0 1 .4477 1 1v5c0 .5523-.4477 1-1 1H1c-.5523 0-1-.4477-1-1v-5c0-.5523.4477-1 1-1zm0 1v5h15v-5H1zm4-1v1h7v-1H5z"
      fillRule="evenodd"
      fill="#0ABE55"
    />
  </SVG>
);

export default ImportIcon;
