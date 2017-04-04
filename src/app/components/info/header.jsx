import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Button } from '../basic';
import {
  DownloadIcon,
  CopyIcon,
  RemoveIcon,
  TripleDot,
  ArrowBackIcon,
  TitleShellIcon,
} from '../svg';
import enLang from '../../langs/en.json';
import StyledAnimatedIcon from '../sidebar/parts/shell.styles';

const StyledShellTitle = StyledAnimatedIcon(TitleShellIcon, 't_gradient');

const TitleShell = styled.div`
  display: table-cell;
  vertical-align: middle;
  width: 200px;
`;

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
  fill: ${props => (
    props.active ?
      props.theme.info.header.activeBurgerColor :
      props.theme.info.header.burgerColor
  )}
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
  width: 100%;
  height: calc(100% - 57px);
  display: table;
  background: ${props => props.theme.info.header.dropdownColor};
  animation: ${props => props.theme.mixins.fadeIn} 300ms;
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
    onDownload: PropTypes.func,
    onCopy: PropTypes.func,
    onRemove: PropTypes.func,
    onMenu: PropTypes.func,
    dataLoaded: PropTypes.bool,
    isKey: PropTypes.bool,
  };

  static defaultProps = {
    dataLoaded: false,
    name: '',
    onDownload: () => {},
    onCopy: () => {},
    onRemove: () => {},
    onMenu: () => {},
    isKey: false,
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

  handleDownload = () => {
    const { onDownload } = this.props;

    if (onDownload) {
      onDownload();
    }
  };

  handleCopy() {
    const { onCopy } = this.props;

    this.setState({
      dropdown: false,
    });

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

    this.setState({
      dropdown: false,
    });

    if (onMenu) onMenu();
  }

  toggleDropdown(value) {
    this.setState({
      dropdown: typeof value === Boolean ? value : !this.state.dropdown,
    });
  }

  renderShellState() {
    const { windowSize } = this.context;
    const { device } = windowSize;

    return (
      <HeaderRoot>
        { this.renderMenuButton() }
        <TitleShell>
          <StyledShellTitle />
        </TitleShell>
        {
          device === 'desktop'
            ? this.renderButtons()
            : null
        }
      </HeaderRoot>
    );
  }

  renderDropdown() {
    const { isKey } = this.props;
    const { dropdown } = this.state;

    if (dropdown) {
      return (
        <DropdownMenu>
          <DropdownItemsWrapper>
            {
              isKey
              ? null
              : <DropdownItemContainer>
                <DropdownItemStyled onClick={this.handleDownload} secondary>
                  <DownloadIconStyled />
                  { enLang['Info.Header.Download'] }
                </DropdownItemStyled>
              </DropdownItemContainer>
            }
            {
              isKey
                ? null
                : <DropdownItemContainer>
                  <DropdownItemStyled onClick={this.bindedHandleCopy} secondary>
                    <CopyIconStyled />
                    { enLang['Info.Header.CopyToClipboard'] }
                  </DropdownItemStyled>
                </DropdownItemContainer>
            }
            <DropdownItemContainer>
              <DropdownItemStyled onClick={this.bindedHandleRemove} secondary>
                <RemoveIconStyled />
                { enLang['Info.Header.Remove'] }
              </DropdownItemStyled>
            </DropdownItemContainer>
          </DropdownItemsWrapper>
        </DropdownMenu>
      );
    }

    return null;
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

    return null;
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
    const { dataLoaded, isKey } = this.props;

    return (
      <ButtonsContainer>
        {
          isKey
          ? null
          : <StyledButton
            onClick={this.handleDownload}
            secondary
            disabled={!dataLoaded}
          >
            <DownloadIconStyled />
            { enLang['Info.Header.Download'] }
          </StyledButton>
        }
        {
          isKey
            ? null
            : <StyledButton
              onClick={this.bindedHandleCopy}
              secondary
              disabled={!dataLoaded}
            >
              <CopyIconStyled />
              { enLang['Info.Header.CopyToClipboard'] }
            </StyledButton>
        }
        <StyledButton
          onClick={this.bindedHandleRemove}
          secondary
          disabled={!dataLoaded}
        >
          <RemoveIconStyled />
          { enLang['Info.Header.Remove'] }
        </StyledButton>
      </ButtonsContainer>
    );
  }

  render() {
    const {
      dataLoaded,
      name,
    } = this.props;
    const { windowSize } = this.context;
    const { device } = windowSize;

    if (!dataLoaded) {
      return this.renderShellState();
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
