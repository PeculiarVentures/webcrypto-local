import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid';

const SVG = styled.svg``;

const uuid1 = uuid();
const uuid2 = uuid();
const uuid3 = uuid();

const DocRequestIcon = props => (
  <SVG
    viewBox="0 0 46 46"
    {...props}
  >
    <defs>
      <rect id={uuid1} width="34" height="42" rx="1" />
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
      <g transform="translate(6)">
        <use fill="#000" filter={`url(#${uuid2})`} xlinkHref={`#${uuid1}`} />
        <use strokeOpacity=".1" stroke="#445059" mask={`url(#${uuid3})`} strokeWidth="2" fill="#FFF" xlinkHref={`#${uuid1}`} />
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
      </g>
      <path
        d="M35 39.252c-1.243 0-2.25-1.01-2.25-2.25 0-1.244 1.007-2.252 2.25-2.252s2.25 1.01 2.25 2.25c0 1.243-1.007 2.252-2.25 2.252zm7.143-3.642c-.307-.044-.634-.32-.73-.615l-.457-1.11c-.143-.275-.11-.702.075-.95l.744-.988c.185-.248.17-.64-.035-.872l-.814-.815c-.232-.204-.625-.22-.874-.033l-.987.74c-.248.187-.674.22-.948.077l-1.11-.457c-.297-.095-.574-.422-.616-.73l-.174-1.22c-.043-.308-.33-.584-.638-.617 0 0-.19-.02-.578-.02-.385 0-.577.02-.577.02-.307.033-.595.31-.64.616l-.174 1.222c-.044.307-.32.634-.616.73l-1.11.456c-.275.143-.7.11-.948-.076l-.99-.742c-.247-.186-.64-.17-.872.034l-.813.814c-.203.232-.22.625-.033.872l.74.99c.188.247.22.673.077.947l-.458 1.112c-.094.295-.422.572-.728.615l-1.223.174c-.306.044-.582.33-.615.64 0 0-.02.19-.02.577 0 .387.02.58.02.58.033.307.31.594.615.638l1.223.174c.306.044.634.32.728.615l.458 1.11c.144.274.11.703-.076.95l-.74.988c-.187.247-.232.584-.1.745.13.163.508.564.508.566 0 0 .13.117.282.258.153.14.78.337 1.03.152l.987-.742c.248-.185.674-.22.948-.075l1.11.455c.296.094.573.422.616.73l.174 1.22c.043.307.33.585.64.618 0 0 .19.02.576.02.386 0 .577-.02.577-.02.307-.033.595-.31.638-.617l.176-1.222c.043-.306.32-.635.616-.73l1.11-.457c.274-.143.7-.11.948.077l.99.742c.248.185.64.17.872-.035l.812-.812c.205-.233.22-.626.035-.873l-.742-.99c-.184-.245-.218-.673-.074-.947l.456-1.11c.096-.296.422-.572.73-.616l1.22-.174c.31-.044.585-.33.618-.64 0 0 .02-.19.02-.577 0-.385-.02-.577-.02-.577-.033-.307-.31-.595-.617-.64l-1.22-.173z"
        fill="#009CFB"
      />
    </g>
  </SVG>
);

export default DocRequestIcon;
