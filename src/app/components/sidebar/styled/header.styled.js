import styled from 'styled-components';
import { ImportIcon, CreateIcon } from '../../svg';
import { Button } from '../../basic';

export const CreateIc = styled(CreateIcon)`
  width: 14px;
  margin-top: -3px;
`;

export const ImportIc = styled(ImportIcon)`
  width: 17px;
  margin-top: -2px;
`;

export const BtnsContainer = styled.div`
  background: ${props => props.theme.sidebar.backgroundHeader};
  padding: 24px 30px;
  @media ${props => props.theme.media.mobile} {
    padding: 12px;
  }
`;

export const Container = styled.div`
  padding: 24px 25px 8px;
  label {
    color: rgba(151, 161, 169, 0.5);
  }
  input, select {
    background: transparent;
    color: ${props => (
      props.disabled
        ? 'rgba(151, 161, 169, 0.5)'
        : '#D6DBDE'
    )};
    border-color: ${props => (
      props.disabled
        ? 'rgba(151, 161, 169, 0.5)'
        : '#D6DBDE'
    )};
  }
  svg {
    fill: ${props => (
      props.disabled
        ? 'rgba(151, 161, 169, 0.5)'
        : '#D6DBDE'
    )};
  }
  @media ${props => props.theme.media.mobile} {
    padding: 13px 12px 5px;
  }
`;

export const SelectContainer = styled.div`
  display: inline-block;
  vertical-align: bottom;
  width: calc(100% - 6px - 40px);
`;

export const ReloadBtn = styled.div`
  ${props => props.theme.mixins.ghostVerticalAlign};
  display: inline-block;
  vertical-align: bottom;
  width: 40px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => (
    props.disabled
      ? 'rgba(151, 161, 169, 0.5)'
      : '#D6DBDE'
  )};
  transition: border-color ${props => props.theme.basicTransition}ms;
  border-radius: 3px;
  margin-left: 6px;
  height: 28px;
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
    fill: ${props => (
      props.disabled
      ? 'rgba(151, 161, 169, 0.5)'
      : '#D6DBDE'
    )};
    transition: fill ${props => props.theme.basicTransition}ms;
  }
`;

export const Btn = styled(Button)`
  margin-left: 6px;
  width: calc(50% - 3px);
  padding: 0 10px !important;
  &:first-child {
    margin-left: 0;
  }
  position: relative;
`;

export const SidebarHeader = styled.div`
  height: 164px;
  z-index: 1;
  position: relative;
  @media ${props => props.theme.media.mobile} {
    height: 122px;
  }
`;
