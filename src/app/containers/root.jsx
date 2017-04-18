import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Info from '../components/info/index';
import Sidebar from '../components/sidebar/index';
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
    dispatch: PropTypes.func,
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    params: {},
    dispatch: () => {},
    loaded: false,
    status: 'seaching',
    providers: [],
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
    // const { dispatch, certificates, params } = this.props;
    // const selectedCertificate = this.getSelectedCertificateProps();
    //
    // if (!certificates.length) {
    //   dispatch(RoutingActions.push(''));
    // } else if (params.id) {
    //   dispatch(CertificateActions.select(params.id));
    // } else if (!selectedCertificate.id && certificates.length) {
    //   dispatch(CertificateActions.select(certificates[0].id));
    // }
    //
    // if (!certificates.length) {
    //   this.handleRootAction({ type: 'SIDEBAR:OPEN' });
    // }
  }

  componentDidUpdate(prevProps) {
    // const { params, dispatch, certificates } = this.props;
    //
    // const selectedCert = this.getSelectedCertificateProps();
    // const selectedCertId = selectedCert.id;
    // const paramsId = params.id;
    // const certificatesLength = certificates.length;
    // const prevCertificatesLength = prevProps.certificates.length;
    // const firstCertificate = certificates[0];
    //
    // if (!paramsId && !selectedCertId && certificatesLength) {
    //   dispatch(CertificateActions.select(firstCertificate.id));
    //   dispatch(RoutingActions.push(`certificate/${firstCertificate.id}`));
    // }
    //
    // if (selectedCertId && paramsId && (selectedCertId !== paramsId)) {
    //   dispatch(CertificateActions.select(selectedCertId));
    //   dispatch(RoutingActions.push(`certificate/${selectedCertId}`));
    // }
    //
    // if (
    //   paramsId && !selectedCertId
    //   && (prevCertificatesLength !== certificatesLength)
    //   && firstCertificate
    // ) {
    //   dispatch(CertificateActions.select(firstCertificate.id));
    //   dispatch(RoutingActions.push(`certificate/${firstCertificate.id}`));
    // }
    //
    // // if remove last certificate
    // if (prevCertificatesLength === 1 && !certificatesLength) {
    //   this.handleRootAction({ type: 'SIDEBAR:OPEN' });
    //   dispatch(RoutingActions.push(''));
    // }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.bindedOnResize);
  }

  onResize() {
    this.setState({
      windowSize: RootContainer.getWindowSize(),
    });
  }

  getSelectedProviderProps() {
    const { providers } = this.props;
    let provider = {};

    providers.map((prv) => {
      if (prv.selected) {
        provider = prv;
      }
      return true;
    });

    return provider;
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
    const { loaded, status, providers } = this.props;
    const { sidebarOpen } = this.state;
    const selectedProviderProps = this.getSelectedProviderProps();

    return (
      <ContentStyled>
        <Sidebar
          open={sidebarOpen}
          loaded={loaded}
          status={status}
          providers={providers}
          provider={selectedProviderProps}
        />
        <InfoStyled>
          <Info
            loaded={loaded}
            provider={selectedProviderProps}
          />
        </InfoStyled>
        <Snackbars />
        <Overlay {...this.props} />
      </ContentStyled>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(RootContainer);
