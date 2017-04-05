import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import Header from './header';
import Body from './body';
import { WSActions } from '../../actions/state';
import { RoutingActions } from '../../actions/ui';

const CertificateCreateStyled = styled.div`
  height: 100%;
  width: 100%;
  background: ${props => props.theme.certificateCreate.background};
`;

export default class CertificateCreate extends Component {

  static propTypes = {
    dataLoaded: PropTypes.bool,
    serverStatus: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    dataLoaded: false,
    serverStatus: 'seaching',
    providers: [],
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  onCancelHandler = () => {
    const { dispatch } = this.context;
    dispatch(RoutingActions.back());
  };

  onCreateHandler = (data) => {
    const { dispatch } = this.context;
    dispatch(WSActions.createCertificate(data));
  };

  render() {
    const { dataLoaded, serverStatus, providers } = this.props;
    return (
      <CertificateCreateStyled>
        <Header
          onBack={this.onCancelHandler}
        />
        <Body
          onCancel={this.onCancelHandler}
          onCreate={this.onCreateHandler}
          dataLoaded={dataLoaded}
          serverStatus={serverStatus}
          providers={providers}
        />
      </CertificateCreateStyled>
    );
  }
}
