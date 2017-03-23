import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import CertificateCreateHeader from './certificate_create_header';
import CertificateCreateBody from './certificate_create_body';
import countriesData from '../../constants/countries.json';
import { CertificateActions } from '../../actions/state';
import { RoutingActions } from '../../actions/ui';
/* eslint no-unused-vars: 0 */
import datePickerStyles from './parts/date_picker.styles';

const CertificateCreateStyled = styled.div`
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: ${props => props.theme.certificateCreate.background};
  z-index: 15;
`;

export default class CertificateCreate extends Component {

  static propTypes = {
    algorithms: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    keySizes: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    countries: PropTypes.oneOfType([
      PropTypes.array,
    ]),
  };

  static defaultProps = {
    algorithms: ['RSASSA-PKCS1-v1_5', 'RSA-OAEP', 'ECDSA', 'ECDH'],
    keySizes: ['256', '512', '1024'],
    countries: countriesData,
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

    const now = new Date().getTime().toString();
    const keyInfo = Object.assign({}, data.keyInfo, {
      createdAt: now,
      lastUsed: now,
    });
    const _data = Object.assign({}, data, {
      keyInfo,
    });

    dispatch(CertificateActions.add(_data));
  };

  render() {
    const { algorithms, keySizes, countries } = this.props;

    return (
      <CertificateCreateStyled>
        <CertificateCreateHeader
          onBack={this.onCancelHandler}
        />
        <CertificateCreateBody
          algorithms={algorithms}
          keySizes={keySizes}
          countries={countries}
          onCancel={this.onCancelHandler}
          onCreate={this.onCreateHandler}
        />
      </CertificateCreateStyled>
    );
  }
}
