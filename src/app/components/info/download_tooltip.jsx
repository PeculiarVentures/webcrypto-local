import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  // opacity: 0;
  background: ${props => props.theme.tooltip.background};
  border: 1px solid ${props => props.theme.tooltip.borderColor};
  box-shadow: 0 4px 15px 0 rgba(112,125,134,0.15);
  border-radius: 3px;
  &:before {
    position: absolute;
    top: -10px;
    right: 50%;
    margin-right: -7px;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent ${props => props.theme.tooltip.borderColor} transparent;
  }
  &:after {
    position: absolute;
    top: -8.5px;
    margin-right: -7px;
    right: 50%;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent ${props => props.theme.tooltip.background} transparent;
  }
`;

export default class DownloadTooltip extends Component {
  render() {
    return (
      <Container>
        Tooltip
      </Container>
    );
  }
}
