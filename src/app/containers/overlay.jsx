import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Taber } from '../helpers';
import { SegueHandler } from '../components/basic';
import * as Dialog from '../components/dialogs';
import { ACTIONS_CONST } from '../constants';
import { CertificateActions } from '../actions/state';
import { DialogActions } from '../actions/ui';

const OverlayStyled = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  overflow: auto;
`;

export default class Overlay extends Component {

  static propTypes = {
    dialog: PropTypes.string,
    modal: PropTypes.string,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  static checkNeedRender({ dialog, modal }) {
    return dialog || modal;
  }

  componentDidMount() {
    if (Overlay.checkNeedRender(this.props)) {
      this.initTaber();
    }
  }

  componentDidUpdate(prevProps) {
    const needRender = Overlay.checkNeedRender(this.props);

    if (Overlay.checkNeedRender(prevProps) !== needRender) {
      if (needRender) {
        this.initTaber();
      }
    }
  }

  initTaber() {
    return new Taber({
      rootNode: this.refRootNode,
    });
  }

  renderModal() {
    const { modal } = this.props;

    // if (modal) {
    //   return (
    //     <SegueHandler
    //       query={modal}
    //       name="Confirms"
    //     >
    //       <CertificateCreate
    //         name="certificate_create"
    //       />
    //     </SegueHandler>
    //   );
    // }

    return null;
  }

  getSelectedCertificateProps() {
    const { certificates } = this.props;
    let certificate = {};

    certificates.map((cert) => {
      if (cert.selected) {
        certificate = cert;
      }
    });

    return certificate;
  }

  handleAction = (payload) => {
    const { type, id } = payload;
    const { dispatch } = this.context;

    switch (type) {
      case ACTIONS_CONST.CERTIFICATE_REMOVE: {
        dispatch(CertificateActions.remove(id));
        break;
      }

      case ACTIONS_CONST.DIALOG_CLOSE: {
        dispatch(DialogActions.close());
        break;
      }

      default:
        return true;
    }
  };

  renderDialog() {
    const { dialog } = this.props;

    if (dialog) {
      const selectedCertificateProps = this.getSelectedCertificateProps();
      return (
        <SegueHandler
          query={dialog}
          name="Confirms"
        >
          <Dialog.RemoveCertificateDialog
            name="remove_certificate"
            certificateName={selectedCertificateProps.name}
            onAccept={() => (
              this.handleAction({
                type: ACTIONS_CONST.CERTIFICATE_REMOVE,
                id: selectedCertificateProps.id,
              })
            )}
            onCancel={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              })
            )}
          />
        </SegueHandler>
      );
    }

    return null;
  }

  render() {
    if (Overlay.checkNeedRender(this.props)) {
      return (
        <OverlayStyled
          innerRef={rootNode => (this.refRootNode = rootNode)}
        >
          { this.renderModal() }
          { this.renderDialog() }
        </OverlayStyled>
      );
    }

    return null;
  }
}
