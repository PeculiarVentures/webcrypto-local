import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const CopyIcon = props => (
  <SVG
    viewBox="0 0 11 13"
    {...props}
  >
    <g fillRule="evenodd">
      <path d="M8 2V.995C8 .455 7.554 0 7.003 0H.997C.453 0 0 .446 0 .995v8.01c0 .54.446.995.997.995H2V9h-.742C1.115 9 1 8.887 1 8.752V1.248C1 1.11 1.104 1 1.258 1h5.484c.143 0 .258.113.258.248V2h1z" />
      <path d="M3 3.995c0-.55.453-.995.997-.995h6.006c.55 0 .997.456.997.995v8.01c0 .55-.453.995-.997.995H3.997c-.55 0-.997-.456-.997-.995v-8.01zm1 .253C4 4.11 4.104 4 4.258 4h5.484c.143 0 .258.113.258.248v7.504c0 .137-.104.248-.258.248H4.258C4.115 12 4 11.887 4 11.752V4.248z" />
    </g>
  </SVG>
);

export default CopyIcon;
