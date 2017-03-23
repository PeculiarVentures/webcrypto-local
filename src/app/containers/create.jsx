import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CertificateCreate } from '../components/certificate_create';

const ContentStyled = styled.div`
  height: 100%;
`;

class CreateContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
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
    return (
      <ContentStyled>
        <CertificateCreate />
      </ContentStyled>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(CreateContainer);
