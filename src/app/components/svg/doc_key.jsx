import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid';

const SVG = styled.svg``;

const uuid1 = uuid();
const uuid2 = uuid();
const uuid3 = uuid();

const DocKeyIcon = props => (
  <SVG
    viewBox="0 0 46 46"
    {...props}
  >
    <defs>
      <rect id={uuid1} x="6" y="2" width="34" height="42" rx="1" />
      <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id={uuid2}>
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur stdDeviation="20" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
        <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0241168478 0" in="shadowBlurOuter1" />
      </filter>
      <mask id={uuid3} x="0" y="0" width="34" height="42" fill="#fff">
        <use xlinkHref={`#${uuid1}`} />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd">
      <use fill="#000" filter={`url(#${uuid2})`} xlinkHref={`#${uuid1}`} />
      <use strokeOpacity=".1" stroke="#445059" mask={`url(#${uuid3})`} strokeWidth="2" fill="#FFF" xlinkHref={`#${uuid1}`} />
      <path
        d="M24.36 26.94c.304-.26.497-.65.497-1.083 0-.79-.64-1.428-1.428-1.428-.79 0-1.43.638-1.43 1.427 0 .433.193.822.498 1.084l-.303 1.513c-.107.538.252.976.804.976h.858c.553 0 .912-.438.804-.977l-.302-1.512zm4.07-5.284V18c0-2.76-2.24-5-5-5-2.757 0-5 2.24-5 5v3.656c-.826.248-1.43 1.007-1.43 1.906v7.447c0 1.093.9 1.99 2.01 1.99h8.838c1.105 0 2.01-.89 2.01-1.99V23.56c0-.895-.603-1.658-1.43-1.906zm-7.93-.085v-3.566c0-1.66 1.347-3.004 3-3.004 1.657 0 3 1.336 3 3.004v3.567h-6z"
        fill="#445059"
        opacity=".25"
      />
      <path
        d="M24 33v1h2.502c.275 0 .498.214.498.505v.99c0 .28-.215.505-.498.505H24v.5c0 .276-.214.5-.505.5h-.99c-.28 0-.505-.228-.505-.5V20.917c-2.838-.476-5-2.944-5-5.917 0-3.314 2.686-6 6-6s6 2.686 6 6c0 2.973-2.162 5.44-5 5.917V28h2.502c.275 0 .498.214.498.505v.99c0 .28-.215.505-.498.505H24v1h1.51c.27 0 .49.214.49.505v.99c0 .28-.215.505-.49.505H24zm-1-14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
        fill="#009CFB"
      />
    </g>
  </SVG>
);

export default DocKeyIcon;
