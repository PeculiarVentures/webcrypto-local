import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Info from '../components/info/index';
import { Sidebar } from '../components/sidebar';
import Overlay from './overlay';
import { CertificateActions } from '../actions/state';
import { RoutingActions } from '../actions/ui';
import Snackbars from '../components/snackbars';

const ContentStyled = styled.div`
  height: 100%;
`;

const InfoStyled = styled.div`
  width: calc(100% - 320px);
  height: 100%;
  display: inline-block;
  vertical-align: top;
  @media ${props => props.theme.media.mobile} {
    width: 100%;
  }
`;

class RootContainer extends Component {

  static propTypes = {
    params: PropTypes.oneOfType([
      PropTypes.object,
    ]),
    location: PropTypes.oneOfType([
      PropTypes.object,
    ]),
    dispatch: PropTypes.func,
    certificates: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    dataLoaded: PropTypes.bool,
    serverIsOnline: PropTypes.bool,
  };

  static defaultProps = {
    params: {},
    location: {},
    dispatch: () => {},
    certificates: [],
    dataLoaded: false,
    serverIsOnline: false,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
    windowSize: PropTypes.object,
    handleRootAction: PropTypes.func,
  };

  static getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let device = 'desktop';

    if (width <= 1024 && width > 736) {
      device = 'tablet';
    } else if (width <= 736) {
      device = 'mobile';
    }

    return {
      width,
      height,
      device,
    };
  }

  constructor() {
    super();

    this.state = {
      windowSize: RootContainer.getWindowSize(),
      sidebarOpen: false,
    };

    this.bindedOnResize = ::this.onResize;

    window.addEventListener('resize', this.bindedOnResize);
  }

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
      windowSize: this.state.windowSize,
      handleRootAction: this.handleRootAction.bind(this),
    };
  }

  componentDidMount() {
    const { dispatch, certificates, params } = this.props;
    const selectedCertificate = this.getSelectedCertificateProps();

    if (params.id) {
      dispatch(CertificateActions.select(params.id));
    } else if (!selectedCertificate.id && certificates.length) {
      dispatch(CertificateActions.select(certificates[0].id));
    }

    if (!certificates.length) {
      this.handleRootAction({ type: 'SIDEBAR:OPEN' });
    }
  }

  componentDidUpdate(prevProps) {
    const { params, dispatch, certificates } = this.props;

    const selectedCert = this.getSelectedCertificateProps();

    if (!params.id && !selectedCert.id && certificates.length) {
      dispatch(CertificateActions.select(certificates[0].id));
      dispatch(RoutingActions.push(`certificate/${certificates[0].id}`));
    }

    if (selectedCert.id && params.id && (selectedCert.id !== params.id)) {
      dispatch(CertificateActions.select(selectedCert.id));
      dispatch(RoutingActions.push(`certificate/${selectedCert.id}`));
    }

    if (params.id && !selectedCert.id && (prevProps.certificates.length !== certificates.length)) {
      dispatch(CertificateActions.select(certificates[0].id));
      dispatch(RoutingActions.push(`certificate/${certificates[0].id}`));
    }

    if (prevProps.certificates.length === 1 && !certificates.length) {
      this.handleRootAction({ type: 'SIDEBAR:OPEN' });
      dispatch(RoutingActions.push(''));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.bindedOnResize);
  }

  onResize() {
    this.setState({
      windowSize: RootContainer.getWindowSize(),
    });
  }

  getSelectedCertificateProps() {
    const { certificates } = this.props;
    let certificate = {};

    certificates.map((cert) => {
      if (cert.selected) {
        certificate = cert;
      }
      return true;
    });

    return certificate;
  }

  handleRootAction(payload) {
    const { type } = payload;

    switch (type) {
      case 'SIDEBAR:OPEN': {
        this.setState({
          sidebarOpen: true,
        });
        return true;
      }

      case 'SIDEBAR:CLOSE': {
        this.setState({
          sidebarOpen: false,
        });
        return true;
      }

      default:
        return true;
    }
  }

  render() {
    const { certificates, dataLoaded, serverIsOnline } = this.props;
    const { sidebarOpen } = this.state;

    return (
      <ContentStyled>
        <Sidebar
          open={sidebarOpen}
          list={certificates}
          dataLoaded={dataLoaded}
          serverIsOnline={serverIsOnline}
        />
        <InfoStyled>
          <Info
            dataLoaded={dataLoaded}
            certificate={this.getSelectedCertificateProps()}
          />
        </InfoStyled>
        <Snackbars />
        <Overlay {...this.props} />
      </ContentStyled>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(RootContainer);
