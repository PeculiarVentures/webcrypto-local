import styled from 'styled-components';
import { ArrowSelectDownIcon } from '../../../svg';
import { ButtonStyled } from './button.styled';
import Button from '../button';

export const ArrowIcon = styled(ArrowSelectDownIcon)`
  width: 8px;
  display: block;
  margin: 0 !important;
`;

export const Btn = styled(Button)`
  border-radius: ${props => props.theme.borderRadius}px 0 0 ${props => props.theme.borderRadius}px;
`;

export const Container = styled.div`
  display: inline-block;
  vertical-align: top;
  position: relative;
`;

export const ArrowBtn = styled(ButtonStyled)`
  border-radius: 0 ${props => props.theme.borderRadius}px ${props => props.theme.borderRadius}px 0;
  width: 30px;
  padding: 0;
`;

export const ArrowBtnContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 1px;
`;

export const DropdownWrapper = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 100%;
  z-index: 10;
  text-align: left;
  animation: ${props => props.theme.mixins.fadeIn} ${props => props.theme.basicTransition}ms;
  display: ${props => (
    props.disabled
      ? 'none'
      : 'block'
  )};
`;

export const DropdownContainer = styled.div`
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
    right: 8px;
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
    right: 8px;
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 7px 7px 7px;
    border-color: transparent transparent ${props => props.theme.tooltip.background} transparent;
  }
`;

export const Item = styled.div`
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