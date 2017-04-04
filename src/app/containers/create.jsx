import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CertificateCreate from '../components/certificate_create/index';

const ContentStyled = styled.div`
  height: 100%;
`;

class CreateContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    dataLoaded: PropTypes.bool,
    serverStatus: PropTypes.string,
  };

  static defaultProps = {
    dispatch: null,
    dataLoaded: false,
    serverStatus: 'seaching',
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
    const { dataLoaded, serverStatus } = this.props;
    return (
      <ContentStyled>
        <CertificateCreate
          dataLoaded={dataLoaded}
          serverStatus={serverStatus}
        />
      </ContentStyled>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(CreateContainer);
