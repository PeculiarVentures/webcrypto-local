import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';

const basicStyles = `
  font-size: 13px;
  letter-spacing: 0.03em;
  display: inline-block;
  vertical-align: top;
  padding: 0 20px;
  cursor: pointer;
  height: 36px;
  border-width: 1px;
  border-style: solid;
  font-family: inherit;
  text-align: center;
  &:hover,
  &:focus {
    opacity: 0.6;
  }
  svg {
    display: inline-block;
    vertical-align: middle;
    max-height: 14px;
    max-width: 16px;
    margin-right: 7px;
  }
  &:disabled {
    opacity: 1;
    cursor: default;
  }
`;

const readyStyles = (props) => {
  const { button, borderRadius, basicTransition, media } = props.theme;
  let borderColor = button.default.borderColor;
  let color = button.default.color;
  let background = button.default.background;

  if (props.primary) {
    borderColor = button.primary.borderColor;
    color = button.primary.color;
    background = button.primary.background;
  } else if (props.secondary) {
    borderColor = button.secondary.borderColor;
    color = button.secondary.color;
    background = button.secondary.background;
  }

  if (props.disabled) {
    borderColor = button.disabled.borderColor;
    color = button.disabled.color;
    background = button.disabled.background;
  }

  return `
    ${basicStyles}
    border-radius: ${borderRadius}px;
    transition: opacity ${basicTransition}ms;
    color: ${color};
    border-color: ${borderColor};
    background: ${background};
    svg {
      fill: ${color};
    }
    @media ${media.mobile} {
      height: 32px;
      font-size: 12px;
    }
  `;
};

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    href: PropTypes.string,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    primary: false,
    secondary: false,
    href: '',
    disabled: false,
  };

  render() {
    const { children, href, disabled } = this.props;
    const ButtonStyled = styled[href && !disabled ? 'a' : 'button']`
      ${props => readyStyles(props)}
    `;

    return (
      <ButtonStyled
        tabIndex={0}
        {...this.props}
      >
        {children}
      </ButtonStyled>
    );
  }
}
