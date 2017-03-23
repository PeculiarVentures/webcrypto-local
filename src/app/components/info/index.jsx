import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Header from './header';
import CertificateInfo from './info_certificate.jsx';
import KeyInfo from './info_key.jsx';
import { DialogActions } from '../../actions/ui';

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
    certificate: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      keyInfo: PropTypes.shape({
        createdAt: PropTypes.string,
        lastUsed: PropTypes.string,
        algorithm: PropTypes.string,
        size: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        usages: PropTypes.arrayOf(PropTypes.string),
      }),
      hostName: PropTypes.string,
      organization: PropTypes.string,
      organizationUnit: PropTypes.string,
      country: PropTypes.string,
      region: PropTypes.string,
      city: PropTypes.string,
      startDate: PropTypes.string,
      expirationDate: PropTypes.string,
    }),
  };

  static defaultProps = {
    certificate: {},
  };

  onRemoveHandler = () => {
    const { dispatch } = this.context;
    dispatch(DialogActions.open('remove_certificate'));
  };

  renderContent() {
    const { certificate } = this.props;
    const { type } = certificate;

    switch (type) {
      case 'certificate':
        return (
          <CertificateInfo {...certificate} />
        );

      case 'key':
        return (
          <KeyInfo {...certificate} />
        );

      default:
        return null;
    }
  }

  onMenuHandler = () => {
    const { handleRootAction } = this.context;
    handleRootAction({
      type: 'SIDEBAR:OPEN',
    });
  };

  render() {
    const { certificate } = this.props;

    return (
      <RootStyled>
        <HeaderContainer>
          <Header
            name={certificate.name}
            type={certificate.type}
            onCopy={() => {
              console.log('clicked Copy button');
            }}
            onDownload={() => {
              console.log('clicked Download button');
            }}
            onRemove={this.onRemoveHandler}
            onMenu={this.onMenuHandler}
          />
        </HeaderContainer>
        <InfoContainer>
          {
            this.renderContent()
          }
        </InfoContainer>
      </RootStyled>
    );
  }
}
