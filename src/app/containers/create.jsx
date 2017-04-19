import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Overlay from './overlay';
import CertificateCreate from '../components/create_certificate';

const ContentStyled = styled.div`
  height: 100%;
`;

class CreateContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    dispatch: null,
    loaded: false,
    status: 'seaching',
    providers: [],
    readOnly: false,
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
  };

  getChildContext() {
    return {
      dispatch: this.props.dispatch,
    };
  }

  render() {
    const { loaded, status, providers, dialog, modal } = this.props;
    const selectedProviderProps = providers.filter(p => p.selected)[0];

    return (
      <ContentStyled>
        <CertificateCreate
          loaded={loaded}
          status={status}
          providers={providers}
          provider={selectedProviderProps}
        />
        <Overlay
          provider={selectedProviderProps}
          dialog={dialog}
          providers={providers}
          modal={modal}
        />
      </ContentStyled>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(CreateContainer);
