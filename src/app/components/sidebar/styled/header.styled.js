import styled from 'styled-components';
import { ImportIcon, CreateIcon } from '../../svg';
import { Button } from '../../basic';

export const Logo = styled.div`
  margin-left: 31px;
  width: 92px;
  @media ${props => props.theme.media.mobile} {
    margin-left: 14px;
  }
`;

export const CreateIc = styled(CreateIcon)`
  width: 18px;
  margin-top: -3px;
`;

export const ImportIc = styled(ImportIcon)`
  width: 22px;
  margin-top: -2px;
`;

export const BtnsContainer = styled.div`
  padding: 40px 30px 26px;
  position: relative;
  &:after {
    position: absolute;
    width: calc(100% - 60px);
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    content: '';
    height: 1px;
    background: ${props => props.theme.info.header.borderColor};
  }
  @media ${props => props.theme.media.mobile} {
    padding: 12px;
    &:after {
      width: calc(100% - 24px);
    }
  }
`;

export const Container = styled.div`
  padding: 40px 30px 30px;
  @media ${props => props.theme.media.mobile} {
    padding: 13px 12px 5px;
  }
`;

export const SelectContainer = styled.div`
  display: inline-block;
  vertical-align: bottom;
  width: calc(100% - 2px - 40px);
  [data-class="field"] {
    background: #F9FAFB;
    box-shadow: 0 3px 10px 0 rgba(64,72,79,0.05);
    height: 40px;
  }
  [data-class="select_arrow"] {
    bottom: 16px;
  }
`;

export const ReloadBtn = styled.div`
  ${props => props.theme.mixins.ghostVerticalAlign};
  display: inline-block;
  vertical-align: bottom;
  width: 40px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(214, 219, 222, 0.62);
  transition: border-color ${props => props.theme.basicTransition}ms;
  border-radius: 3px;
  margin-left: 2px;
  height: 40px;
  cursor: ${props => (
    props.disabled
      ? 'default'
      : 'pointer'
  )};
  text-align: center;
  svg {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    fill: rgba(112, 125, 134, 0.5);
    transition: fill ${props => props.theme.basicTransition}ms;
  }
`;

export const Btn = styled(Button)`
  text-align: left;
  margin-left: 6px;
  width: calc(50% - 3px);
  padding: 0 10px !important;
  &:first-child {
    margin-left: 0;
  }
  position: relative;
  border: none;
  background: transparent;
  svg {
    max-width: 23px;
    max-height: 20px;
  }
`;

export const SidebarHeader = styled.div`
  padding-top: 27px;
  height: 279px;
  z-index: 1;
  position: relative;
  @media ${props => props.theme.media.mobile} {
    height: 194px;
  }
`;
