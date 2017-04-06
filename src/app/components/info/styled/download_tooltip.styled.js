import styled from 'styled-components';

export const ItemStyled = styled.div`
  font-size: 12px;
  letter-spacing: 0.042em;
  padding: 5px 0;
  line-height: 16px;
  cursor: pointer;
  color: ${props => props.theme.button.secondary.color};
  border-top: 1px solid ${props => props.theme.info.header.borderColor};
  transition: opacity ${props => props.theme.basicTransition}ms;
  &:first-child {
    border: none;
  }
  &:hover {
    opacity: 0.6;
  }
`;

export const WrapperStyled = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 10;
  opacity: 0;
  width: 100%;
  text-align: left;
  visibility: hidden;
  transition: opacity ${props => props.theme.basicTransition}ms;
  display: ${props => (
    props.disabled
      ? 'none'
      : 'block'
  )};
`;

export const ContainerStyled = styled.div`
  background: ${props => props.theme.tooltip.background};
  border: 1px solid ${props => props.theme.tooltip.borderColor};
  box-shadow: 0 4px 15px 0 rgba(112,125,134,0.15);
  border-radius: 3px;
  padding: 11px 38px 6px 16px;
  margin-top: 10px;
  position: relative;
  &:before {
    position: absolute;
    top: -7px;
    right: 50%;
    margin-right: -7px;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 7px 7px 7px;
    border-color: transparent transparent ${props => props.theme.tooltip.borderColor} transparent;
  }
  &:after {
    position: absolute;
    top: -6px;
    margin-right: -7px;
    right: 50%;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 7px 7px 7px;
    border-color: transparent transparent ${props => props.theme.tooltip.background} transparent;
  }
`;
