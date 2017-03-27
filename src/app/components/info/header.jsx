import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Button } from '../basic';
import { DownloadIcon, CopyIcon, RemoveIcon, TripleDot, ArrowBackIcon } from '../svg';
import enLang from '../../langs/en.json';

const HeaderRoot = styled.div`
  border-bottom: 1px solid ${props => props.theme.info.header.borderColor};
  padding: 0 5px 0 14px;
  width: 100%;
  height: 100%;
  display: table;
  vertical-align: middle;
  @media ${props => props.theme.media.mobile} {
    padding: 0;
    display: block;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.008em;
  color: ${props => props.theme.info.header.titleColor};
  line-height: 32px;
  display: table-cell;
  vertical-align: middle;
  @media ${props => props.theme.media.mobile} {
    font-size: 18px;
    text-align: center;
    width: calc(100% - 38px - 38px);
    display: inline-block;
    line-height: 56px;
    margin: 0 auto;
    ${props => props.theme.mixins.truncateText}
  }
`;

const ButtonsContainer = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: right;
  white-space: nowrap;
  @media ${props => props.theme.media.mobile} {
    height: 100%;
  }
`;

const DownloadIconStyled = styled(DownloadIcon)`
  width: 11px;
  margin-top: -3px;
`;

const CopyIconStyled = styled(CopyIcon)`
  width: 9px;
  margin-top: -2px;
`;

const RemoveIconStyled = styled(RemoveIcon)`
  width: 9px;
  margin-top: -2px;
`;

const MobileButtonIconStyles = `
  width: 14px;
  display: block;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

const ArrowBackIconStyled = styled(ArrowBackIcon)`
  ${MobileButtonIconStyles}
  fill: ${props => props.theme.info.header.arrowBackColor};
`;

const TripleDotIconStyled = styled(TripleDot)`
  ${MobileButtonIconStyles}
  fill: ${props => {
    return props.active ?
      props.theme.info.header.activeBurgerColor :
      props.theme.info.header.burgerColor
  }}
`;

const MobileButtonStyled = styled.div`
  width: 38px;
  height: 100%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
`;

const StyledButton = styled(Button)`
  display: inline-block;
  width: auto;
  margin-left: 6px;
  &:first-child {
    margin-left: 0;
  }
`;

const DropdownMenu = styled.div`
  position: fixed;
  left: 0;
  top: 57px;
  width: 100vw;
  height: calc(100vh - 57px);
  display: table;
  background: ${props => props.theme.info.header.dropdownColor};
`;

const DropdownItemsWrapper = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const DropdownItemContainer = styled.div`
  margin-top: 38px;
  text-align: center;
  &:first-child {
    margin-top: 0;
  }
`;

const DropdownItemStyled = styled.div`
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

export default class Header extends Component {

  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    onDownload: PropTypes.func,
    onCopy: PropTypes.func,
    onRemove: PropTypes.func,
    onMenu: PropTypes.func,
  };

  static contextTypes = {
    windowSize: PropTypes.object,
  };

  constructor() {
    super();

    this.state = {
      dropdown: false,
    };

    this.bindedToggleDropdown = ::this.toggleDropdown;
    this.bindedHandleMenu = ::this.handleMenu;
    this.bindedHandleDownload = ::this.handleDownload;
    this.bindedHandleCopy = ::this.handleCopy;
    this.bindedHandleRemove = ::this.handleRemove;
  }

  componentDidUpdate(prevProps, prevState, prevContext) {
    const { windowSize } = this.context;
    const { device } = windowSize;

    if (prevContext.windowSize.device !== device) {
      if (device !== 'mobile') {
        this.toggleDropdown(false);
      }
    }
  }

  handleDownload() {
    const { onDownload } = this.props;

    if (onDownload) {
      onDownload();
    }
  }

  handleCopy() {
    const { onCopy } = this.props;

    if (onCopy) {
      onCopy();
    }
  }

  handleRemove() {
    const { onRemove } = this.props;

    this.setState({
      dropdown: false,
    });

    if (onRemove) {
      onRemove();
    }
  }

  handleMenu() {
    const { onMenu } = this.props;
    if (onMenu) onMenu();
  }

  toggleDropdown(value) {
    this.setState({
      dropdown: typeof value === Boolean ? value : !this.state.dropdown,
    });
  }

  renderEmptyState() {
    return (
      <HeaderRoot>
        { this.renderMenuButton() }
        <Title>
          { enLang['Info.Header.NoOneCertificate'] }
        </Title>
      </HeaderRoot>
    );
  }

  renderDropdown() {
    const { dropdown } = this.state;

    if (dropdown) {
      return (
        <DropdownMenu>
          <DropdownItemsWrapper>
            <DropdownItemContainer>
              <DropdownItemStyled onClick={this.bindedHandleDownload} secondary>
                <DownloadIconStyled />
                {
                  enLang['Info.Header.Download']
                }
              </DropdownItemStyled>
            </DropdownItemContainer>
            <DropdownItemContainer>
              <DropdownItemStyled onClick={this.bindedHandleCopy} secondary>
                <CopyIconStyled />
                {
                  enLang['Info.Header.CopyToClipboard']
                }
              </DropdownItemStyled>
            </DropdownItemContainer>
            <DropdownItemContainer>
              <DropdownItemStyled onClick={this.bindedHandleRemove} secondary>
                <RemoveIconStyled />
                {
                  enLang['Info.Header.Remove']
                }
              </DropdownItemStyled>
            </DropdownItemContainer>
          </DropdownItemsWrapper>
        </DropdownMenu>
      );
    }
  }

  renderMenuButton() {
    const { windowSize } = this.context;
    const { device } = windowSize;

    if (device === 'mobile') {
      return (
        <MobileButtonStyled onClick={this.bindedHandleMenu}>
          <ArrowBackIconStyled />
        </MobileButtonStyled>
      );
    }
  }

  renderBurgerButton() {
    const { dropdown } = this.state;

    return (
      <MobileButtonStyled onClick={this.bindedToggleDropdown}>
        <TripleDotIconStyled active={dropdown} />
      </MobileButtonStyled>
    );
  }

  renderButtons() {
    return (
      <ButtonsContainer>
        <StyledButton
          onClick={this.bindedHandleDownload}
          secondary
        >
          <DownloadIconStyled />
          { enLang['Info.Header.Download'] }
        </StyledButton>
        <StyledButton
          onClick={this.bindedHandleCopy}
          secondary
        >
          <CopyIconStyled />
          { enLang['Info.Header.CopyToClipboard'] }
        </StyledButton>
        <StyledButton
          onClick={this.bindedHandleRemove}
          secondary
        >
          <RemoveIconStyled />
          { enLang['Info.Header.Remove'] }
        </StyledButton>
      </ButtonsContainer>
    );
  }

  render() {
    const {
      type,
      name,
    } = this.props;
    const { windowSize } = this.context;
    const { device } = windowSize;

    if (!type) {
      return this.renderEmptyState();
    }

    return (
      <HeaderRoot>
        { this.renderMenuButton() }
        <Title>
          { name }
        </Title>
        {
          device === 'desktop'
            ? this.renderButtons()
            : this.renderBurgerButton()
        }
        { this.renderDropdown() }
      </HeaderRoot>
    );
  }
}
