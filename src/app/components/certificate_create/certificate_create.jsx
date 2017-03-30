import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import CertificateCreateHeader from './certificate_create_header';
import CertificateCreateBody from './certificate_create_body';
import { WSActions } from '../../actions/state';
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
    const _data = Object.assign({}, data, keyInfo);

    // console.log(_data);
    dispatch(WSActions.createCSR(0, _data));
  };

  render() {
    return (
      <CertificateCreateStyled>
        <CertificateCreateHeader
          onBack={this.onCancelHandler}
        />
        <CertificateCreateBody
          onCancel={this.onCancelHandler}
          onCreate={this.onCreateHandler}
        />
      </CertificateCreateStyled>
    );
  }
}
