import styled from 'styled-components';
// import { Button } from '../../basic';
import {
  DownloadIcon,
  CopyIcon,
  RemoveIcon,
  TripleDot,
  ArrowBackIcon,
  TitleShellIcon,
} from '../../svg';
import StyledAnimatedIcon from '../../sidebar/parts/shell.styles';

export const StyledShellTitle = StyledAnimatedIcon(TitleShellIcon, 't_gradient');

export const TitleShell = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 110px);
  height: 100%;
  svg {
    width: 200px;
    position: relative;
    top: 50%;
    transform: translate(0, -50%);
  }
`;

export const HeaderRoot = styled.div`
  border-bottom: 1px solid ${props => props.theme.info.header.borderColor};
  padding: 0 10px;
  width: 100%;
  height: 100%;
  // display: table;
  // vertical-align: middle;
  @media ${props => props.theme.media.mobile} {
    padding: 0;
    display: block;
  }
`;

export const Title = styled.div`
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.019em;
  color: ${props => props.theme.info.header.titleColor};
  line-height: 75px;
  vertical-align: middle;
  display: inline-block;
  width: calc(100% - 110px - 16px - 20px);
  ${props => props.theme.mixins.truncateText}
  padding-right: 20px;
  @media ${props => props.theme.media.mobile} {
    font-size: 18px;
    text-align: center;
    width: calc(100% - 38px - 38px);
    line-height: 56px;
    margin: 0 auto;
    padding: 0;
    ${props => props.theme.mixins.truncateText}
  }
`;

export const ButtonsContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  text-align: right;
  white-space: nowrap;
  min-width: 110px;
  @media ${props => props.theme.media.mobile} {
    height: 100%;
  }
`;

export const DownloadIconStyled = styled(DownloadIcon)`
  width: 16px;
  display: inline-block;
  vertical-align: middle;
  fill: ${props => props.theme.info.header.iconColor};
`;

export const CopyIconStyled = styled(CopyIcon)`
  width: 14px;
  display: inline-block;
  vertical-align: middle;
  fill: ${props => props.theme.info.header.iconColor};
`;

export const RemoveIconStyled = styled(RemoveIcon)`
  width: 16px;
  display: inline-block;
  vertical-align: middle;
  fill: ${props => props.theme.info.header.iconColorRed};
`;

export const MobileButtonIconStyles = `
  width: 14px;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

export const ArrowBackIconStyled = styled(ArrowBackIcon)`
  ${MobileButtonIconStyles}
  fill: ${props => props.theme.info.header.arrowBackColor};
`;

export const TripleDotIconStyled = styled(TripleDot)`
  ${MobileButtonIconStyles}
  fill: ${props => (
  props.active ?
    props.theme.info.header.activeBurgerColor :
    props.theme.info.header.burgerColor
)}
`;

export const MobileButtonStyled = styled.div`
  width: 38px;
  height: 100%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
`;

// export const StyledButton = styled(Button)`
//   display: inline-block;
//   width: auto;
//   margin-left: 6px;
//   position: relative;
//   &:first-child {
//     margin-left: 0;
//   }
// `;

export const DropdownMenu = styled.div`
  position: fixed;
  left: 0;
  top: 57px;
  width: 100%;
  height: calc(100% - 57px);
  display: table;
  background: ${props => props.theme.info.header.dropdownColor};
  animation: ${props => props.theme.mixins.fadeIn} 300ms;
`;

export const DropdownItemsWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

export const DropdownItemContainer = styled.div`
  margin-top: 38px;
  text-align: center;
  &:first-child {
    margin-top: 0;
  }
`;

export const DropdownItemStyled = styled.div`
  color: ${props => props.theme.info.header.dropdownItemColor};
  font-size: 16px;
  letter-spacing: 0.055em;
  display: inline-block;
  cursor: pointer;
  svg {
    margin-right: 8px;
    fill: ${props => props.theme.info.header.dropdownItemColor};
  }
`;

export const HeaderBtn = styled.div`
  display: inline-block;
  vertical-align: middle;
  height: 36px;
  cursor: pointer;
  width: 25px;
  text-align: center;
  margin-left: 16px;
  transition: opacity 300ms;
  ${props => props.theme.mixins.ghostVerticalAlign}
  &:first-child {
    margin-left: 0;
  }
  &:hover {
    opacity: 0.6;
  }
  ${props => {
    if (props.disabled) {
      return `
        cursor: default;
        opacity: 0.3;
      `;
    }
    return '';
  }}
`;

export const IconContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 16px;
  margin-right: 20px;
  fill: rgba(112, 125, 134, .6);
  margin-top: 6px;
`;
