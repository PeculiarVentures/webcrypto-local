import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid';

const SVG = styled.svg``;

const uuid1 = uuid();
const uuid2 = uuid();
const uuid3 = uuid();

const DocCertIcon = props => (
  <SVG
    viewBox="0 0 46 46"
    {...props}
  >
    <defs>
      <rect id={uuid1} width="34" height="42" rx="1" />
      <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id={uuid3}>
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation="20" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0241168478 0" in="shadowBlurOuter1" />
      </filter>
      <mask id={uuid2} x="0" y="0" width="34" height="42" fill="#fff">
        <use xlinkHref={`#${uuid1}`} />
      </mask>
    </defs>
    <g transform="translate(6 1)" fill="none" fillRule="evenodd">
      <use fill="#000" filter={`url(#${uuid3})`} xlinkHref={`#${uuid1}`} />
      <use strokeOpacity=".1" stroke="#445059" mask={`url(#${uuid2})`} strokeWidth="2" fill="#FFF" xlinkHref={`#${uuid1}`} />
      <rect fill="#445059" opacity=".5" x="6" y="8" width="22" height="2" rx="1" />
      <rect fill="#445059" opacity=".5" x="9" y="12" width="16" height="2" rx="1" />
      <rect fill="#445059" opacity=".25" x="8" y="19" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="21" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="23" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="25" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="27" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="29" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="31" width="18" height="1" rx=".5" />
      <rect fill="#445059" opacity=".25" x="8" y="33" width="18" height="1" rx=".5" />
      <circle fill="#009CFB" cx="29" cy="37" r="8" />
      <path
        d="M28.52 38.105l-1.4-1.398c-.392-.393-1.022-.39-1.413 0-.393.393-.39 1.024 0 1.414l2.046 2.047c.043.07.094.137.154.197.393.393.998.365 1.356-.057l4.36-5.13c.36-.424.33-1.08-.06-1.47-.392-.393-.997-.365-1.355.057l-3.69 4.34z"
        fill="#FFF"
      />
    </g>
  </SVG>
);

export default DocCertIcon;
