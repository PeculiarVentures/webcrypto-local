import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Header from './header';
import CertificateInfo from './info_certificate';
import RequestInfo from './info_request';
import KeyInfo from './info_key';
import EmptyBody from './empty_body';
import { DialogActions, ModalActions } from '../../actions/ui';
import { WSActions } from '../../actions/state';
import { InfoShellIcon } from '../svg';
import StyledAnimatedIcon from '../sidebar/parts/shell.styles';

const StyledShellInfo = StyledAnimatedIcon(InfoShellIcon, 'i_gradient');

const RootStyled = styled.div`
  width: 100%;
  height: 100%;
`;

const HeaderContainer = styled.div`
  padding: 0 25px;
  height: 86px;
  @media ${props => props.theme.media.mobile} {
    height: 56px;
    padding: 0 10px;
  }
`;

const InfoContainer = styled.div`
  height: calc(100% - 86px);
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
    dataLoaded: PropTypes.bool,
    certificate: PropTypes.oneOfType([
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    certificate: {},
    dataLoaded: false,
  };

  onRemoveHandler = () => {
    const { dispatch } = this.context;
    dispatch(DialogActions.open('remove_certificate'));
  };

  onDownloadhandler = (format = 'pem') => {
    const { dispatch } = this.context;
    dispatch(WSActions.downloadCertificate(format));
  };

  onCopyHandler = () => {
    const { dispatch } = this.context;
    dispatch(ModalActions.openModal('copy_certificate'));
  };

  onMenuHandler = () => {
    const { handleRootAction } = this.context;
    handleRootAction({
      type: 'SIDEBAR:OPEN',
    });
  };

  renderInfoContent() {
    const { certificate } = this.props;
    const { type } = certificate;

    switch (type) {
      case 'certificate':
        return (
          <CertificateInfo {...certificate} />
        );

      case 'request':
        return (
          <RequestInfo {...certificate} />
        );

      case 'key':
        return (
          <KeyInfo {...certificate} />
        );

      default:
        return null;
    }
  }

  render() {
    const { certificate, dataLoaded } = this.props;

    switch (true) {
      case !dataLoaded:
        return (
          <RootStyled>
            <HeaderContainer>
              <Header
                dataLoaded={dataLoaded}
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

      case Object.keys(certificate).length > 0:
        return (
          <RootStyled>
            <HeaderContainer>
              <Header
                dataLoaded={dataLoaded}
                name={certificate.name}
                isKey={certificate.type === 'key'}
                onCopy={this.onCopyHandler}
                onDownload={this.onDownloadhandler}
                onRemove={this.onRemoveHandler}
                onMenu={this.onMenuHandler}
              />
            </HeaderContainer>
            <InfoContainer>
              { this.renderInfoContent() }
            </InfoContainer>
          </RootStyled>
        );

      default:
        return (
          <RootStyled>
            <EmptyBody />
          </RootStyled>
        );
    }
  }
}
