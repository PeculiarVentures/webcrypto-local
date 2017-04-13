import React, { PropTypes, Component } from 'react';
import styled, { keyframes } from 'styled-components';

function getArcLength(fraction, props) {
  return fraction * Math.PI * (props.size - props.lineSize);
}

const kfCircle = props => (
  keyframes`
    0% {
      stroke-dasharray: ${getArcLength(0, props)}, ${getArcLength(1, props)};
      stroke-dashoffset: 0;
      transition: 0ms;
    }
    50% {
      stroke-dasharray: ${getArcLength(0.7, props)}, ${getArcLength(1, props)};
      stroke-dashoffset: ${getArcLength(-0.3, props)};
      transition: 750ms;
    }
    100% {
      stroke-dasharray: ${getArcLength(0.7, props)}, ${getArcLength(1, props)};
      stroke-dashoffset: ${getArcLength(-1, props)};
      transition: 850ms;
    }
  `
);

const kfRotate = keyframes`
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(1800deg);
  }
`;

const LoaderStyles = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  font-size: 0;
`;

const Svg = styled.svg`
  display: block;
  width: 100%;
  animation: ${kfRotate} 10s linear infinite both;
`;

const Circle = styled.circle`
  animation: ${props => kfCircle(props)} 1333ms ease-in-out infinite both;
`;

export default class CircularLoader extends Component {

  static propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    lineSize: PropTypes.number,
  };

  static defaultProps = {
    size: 50,
    color: '#77D042',
    lineSize: 2,
  };

  shouldComponentUpdate(nextProps) {
    const { size, lineSize, color } = this.props;
    return (
      nextProps.size !== size ||
      nextProps.lineSize !== lineSize ||
      nextProps.color !== color
    );
  }

  render() {
    const { size, lineSize, color } = this.props;

    return (
      <LoaderStyles size={size}>
        <Svg
          viewBox={`0 0 ${size} ${size}`}
        >
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={(size - lineSize) / 2}
            fill="none"
            strokeWidth={lineSize}
            strokeMiterlimit="20"
            stroke={color}
            size={size}
            lineSize={lineSize}
          />
        </Svg>
      </LoaderStyles>
    );
  }
};


