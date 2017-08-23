import React, { PropTypes, Component } from 'react';
// import { SplitButton } from '../basic';
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
  // StyledButton,
  DropdownMenu,
  DropdownItemsWrapper,
  DropdownItemContainer,
  DropdownItemStyled,
  HeaderBtn,
  IconContainer,
} from './styled/header.styled';
import { DocCertIcon, DocRequestIcon, DocKeyIcon } from '../svg';

export default class Header extends Component {

  static renderIcon(certType) {
    switch (certType) {
      case 'request':
        return <DocRequestIcon />;
      case 'certificate':
        return <DocCertIcon />;
      case 'key':
        return <DocKeyIcon />;
      default:
        return null;
    }
  }

  static propTypes = {
    name: PropTypes.string,
    onDownload: PropTypes.func,
    onCopy: PropTypes.func,
    onRemove: PropTypes.func,
    onMenu: PropTypes.func,
    loaded: PropTypes.bool,
    isKey: PropTypes.bool,
    readOnly: PropTypes.bool,
    type: PropTypes.string,
  };

  static defaultProps = {
    loaded: false,
    name: '',
    onDownload: () => {},
    onCopy: () => {},
    onRemove: () => {},
    onMenu: () => {},
    isKey: false,
    readOnly: false,
    type: '',
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
    const { loaded, isKey, readOnly } = this.props;

    return (
      <ButtonsContainer>
        {
          isKey
          ? null
            : <HeaderBtn
              onClick={() => this.handleDownload('pem')}
              disabled={!loaded}
              title={enLang['Info.Header.Btn.Download']}
            >
              <DownloadIconStyled />
            </HeaderBtn>
          // : <SplitButton
          //   secondary
          //   disabled={!loaded}
          //   onClick={() => this.handleDownload('pem')}
          //   onSelect={value => this.handleDownload(value.toLowerCase())}
          //   list={['PEM', 'DER']}
          // >
          //   <DownloadIconStyled />
          //   { enLang['Info.Header.Btn.Download'] }
          // </SplitButton>
        }
        {
          isKey
            ? null
            : <HeaderBtn
              onClick={this.bindedHandleCopy}
              disabled={!loaded}
              title={enLang['Info.Header.Btn.Copy']}
            >
              <CopyIconStyled />
            </HeaderBtn>
            // : <StyledButton
            //   onClick={this.bindedHandleCopy}
            //   secondary
            //   disabled={!loaded}
            // >
            //   <CopyIconStyled />
            //   { enLang['Info.Header.Btn.Copy'] }
            // </StyledButton>
        }
        {/*<StyledButton*/}
          {/*onClick={this.bindedHandleRemove}*/}
          {/*secondary*/}
          {/*disabled={!loaded || readOnly}*/}
        {/*>*/}
          {/*<RemoveIconStyled />*/}
          {/*{ enLang['Info.Header.Btn.Remove'] }*/}
        {/*</StyledButton>*/}
        <HeaderBtn
          onClick={this.bindedHandleRemove}
          disabled={!loaded || readOnly}
          title={enLang['Info.Header.Btn.Remove']}
        >
          <RemoveIconStyled />
        </HeaderBtn>
      </ButtonsContainer>
    );
  }

  render() {
    const {
      loaded,
      name,
      type,
    } = this.props;
    const { windowSize } = this.context;
    const { device } = windowSize;

    if (!loaded) {
      return this.renderShellState();
    }

    return (
      <HeaderRoot>
        { this.renderMenuButton() }
        {type && (
          <IconContainer>
            { Header.renderIcon(type) }
          </IconContainer>
        )}
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
