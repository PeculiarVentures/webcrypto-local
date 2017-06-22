import styled from 'styled-components';

const defineBtnTypeStyles = (btnTheme, primary, secondary, disabled) => {
  let borderColor = btnTheme.default.borderColor;
  let color = btnTheme.default.color;
  let background = btnTheme.default.background;

  if (primary) {
    borderColor = btnTheme.primary.borderColor;
    color = btnTheme.primary.color;
    background = btnTheme.primary.background;
  } else if (secondary) {
    borderColor = btnTheme.secondary.borderColor;
    color = btnTheme.secondary.color;
    background = btnTheme.secondary.background;
  }

  if (disabled) {
    borderColor = btnTheme.disabled.borderColor;
    color = btnTheme.disabled.color;
    background = btnTheme.disabled.background;
  }

  return `
    color: ${color};
    border-color: ${borderColor};
    background: ${background};
    svg {
      fill: ${color};
    }
  `;
};

export const ButtonStyled = styled.button`
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
  border-radius: ${props => props.theme.borderRadius}px;
  transition: all ${props => props.theme.basicTransition}ms;
  ${props => defineBtnTypeStyles(props.theme.button, props.primary, props.secondary, props.disabled)}
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
  @media ${props => props.theme.media.mobile} {
    height: 32px;
    font-size: 12px;
  }
`;
