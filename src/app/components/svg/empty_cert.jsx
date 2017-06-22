import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const EmptyCertIcon = props => (
  <SVG
    viewBox="0 0 75 91"
    {...props}
  >
    <g transform="translate(-89)">
      <path
        fill="none"
        stroke={props.blackBg ? '#ffffff' : '#9CA6AE'}
        strokeLinecap="round"
        strokeDasharray="3,5,3,5"
        d="M90 0h66c.6 0 1 .4 1 1v82c0 .6-.4 1-1 1H90c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1z"
      />
      <path
        opacity="0.8"
        fill={props.blackBg ? '#ffffff' : '#9CA6AE'}
        enableBackground="new"
        d="M144 17h-42c-.6 0-1 .4-1 1s.4 1 1 1h42c.6 0 1-.4 1-1s-.4-1-1-1zM138 25h-30c-.6 0-1 .4-1 1s.4 1 1 1h30c.6 0 1-.4 1-1s-.4-1-1-1z"
      />
      <path
        opacity="0.6"
        fill={props.blackBg ? '#ffffff' : '#9CA6AE'}
        enableBackground="new"
        d="M105.5 40h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5h-35c-.3 0-.5.2-.5.5s.2.5.5.5zM140.5 43h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM140.5 47h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM140.5 51h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM140.5 55h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM140.5 59h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM140.5 63h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zM140.5 67h-35c-.3 0-.5.2-.5.5s.2.5.5.5h35c.3 0 .5-.2.5-.5s-.2-.5-.5-.5z"
      />
      <circle
        stroke={props.blackBg ? '#282E32' : '#FDFDFD'}
        fill="#009CFB"
        strokeLinecap="round"
        strokeDasharray="3"
        cx="147"
        cy="74"
        r="16"
      />
      <circle
        stroke={props.blackBg ? '#282E32' : '#ffffff'}
        fill={props.blackBg ? '#282E32' : '#ffffff'}
        strokeLinecap="round"
        cx="147"
        cy="74"
        r="15"
      />
      <path
        opacity="0.9"
        fill={props.blackBg ? '#ffffff' : '#9CA6AE'}
        enableBackground="new"
        d="M145.7 77.6L142 74c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.3l4.3 4.3c.1.1.2.2.3.2.4.2.8.1 1.2-.2l7.4-8.2c.4-.4.4-1.1 0-1.5-.4-.4-1-.4-1.4 0l-6.7 7.7z"
      />
    </g>
  </SVG>
);

export default EmptyCertIcon;
