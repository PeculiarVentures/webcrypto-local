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
    opacity: 0.8;
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
  let borderColor = props.theme.button.default.borderColor;
  let color = props.theme.button.default.color;
  let background = props.theme.button.default.background;

  if (props.primary) {
    borderColor = props.theme.button.primary.borderColor;
    color = props.theme.button.primary.color;
    background = props.theme.button.primary.background;
  } else if (props.secondary) {
    borderColor = props.theme.button.secondary.borderColor;
    color = props.theme.button.secondary.color;
    background = props.theme.button.secondary.background;
  }

  if (props.disabled) {
    borderColor = props.theme.button.disabled.borderColor;
    color = props.theme.button.disabled.color;
    background = props.theme.button.disabled.background;
  }

  return `
    ${basicStyles}
    border-radius: ${props.theme.borderRadius}px;
    transition: opacity ${props.theme.basicTransition}ms;
    color: ${color};
    border-color: ${borderColor};
    background: ${background};
    svg {
      fill: ${color};
    }
    @media ${props.theme.media.mobile} {
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
    reverse: PropTypes.bool,
    href: PropTypes.string,
    disabled: PropTypes.bool,
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
