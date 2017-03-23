import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const DownloadIcon = props => (
  <SVG
    viewBox="0 0 13 14"
    {...props}
  >
    <g fillRule="evenodd">
        <rect y="13" width="13" height="1" rx=".5" />
        <rect x="12" y="11" width="1" height="3" rx=".5" />
        <path d="M6 8.393V.51c0-.282.232-.51.5-.51.276 0 .5.228.5.51v7.818l1.282-1.28c.19-.193.51-.184.7.006.195.195.2.505.007.7L6.853 9.89c-.1.098-.234.144-.367.138-.144.018-.294-.028-.405-.14L3.947 7.755c-.192-.192-.183-.51.007-.7.195-.196.505-.202.7-.007L6 8.393z" />
        <rect y="11" width="1" height="3" rx=".5" />
    </g>
  </SVG>
);

export default DownloadIcon;
