import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { CircularLoader } from '../basic';
import Header from './header';
import { ACTIONS_CONST } from '../../constants';
import CertificateInfo from './info_certificate';
import RequestInfo from './info_request';
import KeyInfo from './info_key';
import EmptyBody from './empty_body';
import { DialogActions } from '../../actions/ui';
import { WSActions } from '../../actions/state';
import { InfoShellIcon } from '../svg';
import StyledAnimatedIcon from '../sidebar/parts/shell.styles';
import { EventChannel } from '../../controllers';
import { copyToClipboard } from '../../helpers';

const StyledShellInfo = StyledAnimatedIcon(InfoShellIcon, 'i_gradient');

const RootStyled = styled.div`
  width: 100%;
  height: 100%;
`;

const LoaderContainer = styled(RootStyled)`
  text-align: center;
  ${props => props.theme.mixins.ghostVerticalAlign}
`;

const HeaderContainer = styled.div`
  padding: 0 30px;
  height: 76px;
  @media ${props => props.theme.media.mobile} {
    height: 56px;
    padding: 0 10px;
  }
`;

const InfoContainer = styled.div`
  height: calc(100% - 76px);
  overflow: auto;
  @media ${props => props.theme.media.mobile} {
    height: calc(100% - 56px);
  }
`;

export default class Info extends Component {

  static contextTypes = {
    dispatch: PropTypes.func,
    handleRootAction: PropTypes.func,
  };

  static propTypes = {
    loaded: PropTypes.bool,
    provider: PropTypes.oneOfType([
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    provider: {
      items: [],
      readOnly: false,
    },
    loaded: false,
  };

  onRemoveHandler = () => {
    const { dispatch } = this.context;
    dispatch(DialogActions.open('remove_item'));
  };

  onDownloadhandler = (format = 'pem') => {
    const { dispatch } = this.context;
    dispatch(WSActions.downloadItem(format));
  };

  onCopyHandler = () => {
    const selectedItem = this.getSelectedItemProps();

    copyToClipboard(selectedItem.pem);
    EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'copied', 3000);
  };

  onMenuHandler = () => {
    const { handleRootAction } = this.context;
    handleRootAction({
      type: 'SIDEBAR:OPEN',
    });
  };

  getSelectedItemProps() {
    const { provider } = this.props;
    let item = false;

    if (provider.items) {
      provider.items.map((itm) => {
        if (itm.selected) {
          item = itm;
        }
        return true;
      });
    }

    return item;
  }

  renderInfoContent(type, item) {
    switch (type) {
      case 'certificate':
        return (
          <CertificateInfo {...item} />
        );

      case 'request':
        return (
          <RequestInfo {...item} />
        );

      case 'key':
        return (
          <KeyInfo {...item} />
        );

      default:
        return null;
    }
  }

  render() {
    const { loaded, provider } = this.props;
    const selectedItem = this.getSelectedItemProps();

    if (!loaded) {
      return (
        <RootStyled>
          <HeaderContainer>
            <Header
              loaded={loaded}
            />
          </HeaderContainer>
          <InfoContainer>
            <div
              style={{
                width: '100%',
                maxWidth: 700,
                padding: '75px 20px',
                margin: '0 auto',
              }}
            >
              <StyledShellInfo />
            </div>
          </InfoContainer>
        </RootStyled>
      );
    } else if (loaded && !provider.loaded) {
      return (
        <LoaderContainer>
          <CircularLoader
            color="#000000"
          />
        </LoaderContainer>
      );
    } else if (Object.keys(selectedItem).length > 0) {
      return (
        <RootStyled>
          <HeaderContainer>
            <Header
              readOnly={provider.readOnly}
              loaded={loaded}
              name={selectedItem.name}
              isKey={selectedItem.type === 'key'}
              onCopy={this.onCopyHandler}
              onDownload={this.onDownloadhandler}
              onRemove={this.onRemoveHandler}
              onMenu={this.onMenuHandler}
            />
          </HeaderContainer>
          <InfoContainer>
            { this.renderInfoContent(selectedItem.type, selectedItem) }
          </InfoContainer>
        </RootStyled>
      );
    }
    return (
      <RootStyled>
        <EmptyBody />
      </RootStyled>
    );
  }
}
