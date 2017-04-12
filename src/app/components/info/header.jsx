import React, { PropTypes, Component } from 'react';
import { SplitButton } from '../basic';
import enLang from '../../langs/en.json';
import {
  StyledShellTitle,
  TitleShell,
  HeaderRoot,
  Title,
  ButtonsContainer,
  DownloadIconStyled,
  CopyIconStyled,
  RemoveIconStyled,
  ArrowBackIconStyled,
  TripleDotIconStyled,
  MobileButtonStyled,
  StyledButton,
  DropdownMenu,
  DropdownItemsWrapper,
  DropdownItemContainer,
  DropdownItemStyled,
} from './styled/header.styled';

export default class Header extends Component {

  static propTypes = {
    name: PropTypes.string,
    onDownload: PropTypes.func,
    onCopy: PropTypes.func,
    onRemove: PropTypes.func,
    onMenu: PropTypes.func,
    dataLoaded: PropTypes.bool,
    isKey: PropTypes.bool,
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    dataLoaded: false,
    name: '',
    onDownload: () => {},
    onCopy: () => {},
    onRemove: () => {},
    onMenu: () => {},
    isKey: false,
    readOnly: false,
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

  handleDownload = (format) => {
    const { onDownload } = this.props;

    if (onDownload) {
      onDownload(format === 'pem' ? 'pem' : 'raw');
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
      dropdown: typeof value === 'boolean' ? value : !this.state.dropdown,
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
                  { enLang['Info.Header.Btn.Download'] }
                </DropdownItemStyled>
              </DropdownItemContainer>
            }
            {
              isKey
                ? null
                : <DropdownItemContainer>
                  <DropdownItemStyled onClick={this.bindedHandleCopy} secondary>
                    <CopyIconStyled />
                    { enLang['Info.Header.Btn.Copy'] }
                  </DropdownItemStyled>
                </DropdownItemContainer>
            }
            <DropdownItemContainer>
              <DropdownItemStyled onClick={this.bindedHandleRemove} secondary>
                <RemoveIconStyled />
                { enLang['Info.Header.Btn.Remove'] }
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
    const { dataLoaded, isKey, readOnly } = this.props;

    return (
      <ButtonsContainer>
        {
          isKey
          ? null
          : <SplitButton
            secondary
            disabled={!dataLoaded}
            onClick={() => this.handleDownload('pem')}
            onSelect={value => this.handleDownload(value.toLowerCase())}
            list={['PEM', 'DER']}
          >
            <DownloadIconStyled />
            { enLang['Info.Header.Btn.Download'] }
          </SplitButton>
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
              { enLang['Info.Header.Btn.Copy'] }
            </StyledButton>
        }
        <StyledButton
          onClick={this.bindedHandleRemove}
          secondary
          disabled={!dataLoaded || readOnly}
        >
          <RemoveIconStyled />
          { enLang['Info.Header.Btn.Remove'] }
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
          device !== 'mobile'
            ? this.renderButtons()
            : this.renderBurgerButton()
        }
        { this.renderDropdown() }
      </HeaderRoot>
    );
  }
}
