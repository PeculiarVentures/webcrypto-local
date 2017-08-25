import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const RemoveIcon = props => (
  <SVG
    viewBox="0 0 16 17"
    {...props}
  >
    <path
      d="M4.033 3.012V1.005C4.033.45 4.483 0 5.043 0h5.947C11.547 0 12 .445 12 1.005v2.007h4V4.02h-1.715l-1.37 11.986c-.064.55-.565.994-1.106.994H4.19c-.546 0-1.04-.45-1.104-.994L1.716 4.02H0V3.012h4.033zM2.757 4.02L4.14 16.017h7.732L13.206 4.02H2.756zM4.54 6.56l.993-.12.907 7.38-.993.123L4.54 6.56zm2.95-.228h1v7.465h-1V6.332zm2.958.096l.993.122-.906 7.382-.992-.122.906-7.382zM5.01 1.018v1.977L11 3.012V1.018H5.01z"
      fillRule="evenodd"
    />
  </SVG>
);

export default RemoveIcon;
