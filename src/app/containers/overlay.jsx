import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Taber } from '../helpers';
import { SegueHandler } from '../components/basic';
import * as Dialog from '../components/dialogs';
import { ACTIONS_CONST } from '../constants';
import { WSActions } from '../actions/state';
import { DialogActions } from '../actions/ui';
import ImportCertificate from '../components/import_certificate';
import { WSController } from '../controllers/webcrypto_socket';
import { EventChannel } from '../controllers';

const OverlayStyled = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
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

  constructor() {
    super();

    this.state = {
      message: '',
    };

    EventChannel.on('DIALOG:SET_MESSAGE', this.onSetMessage);
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

    if (prevProps.dialog !== this.props.dialog) {
      this.onSetMessage('');
    }
  }

  onSetMessage = (message) => {
    this.setState({
      message,
    });
  };

  initTaber() {
    return new Taber({
      rootNode: this.refRootNode,
    });
  }

  renderModal() {
    const { modal, providers } = this.props;

    if (modal) {
      return (
        <SegueHandler
          query={modal}
          name="Confirms"
        >
          <ImportCertificate
            name="import_certificate"
            providers={providers}
          />
        </SegueHandler>
      );
    }

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
    const { type } = payload;
    const { dispatch } = this.context;

    switch (type) {
      case ACTIONS_CONST.WS_REMOVE_ITEM: {
        return dispatch(WSActions.removeItem());
      }

      case ACTIONS_CONST.DIALOG_CLOSE: {
        return dispatch(DialogActions.close());
      }

      case 'TRY_AGAIN_LOGIN': {
        dispatch(WSActions.login());
        return dispatch(DialogActions.close());
      }

      case 'TRY_AGAIN_PIN': {
        WSController.connect();
        return dispatch(DialogActions.close());
      }

      default:
        return true;
    }
  };

  renderDialog() {
    const { dialog } = this.props;
    const { message } = this.state;

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
            certificateType={selectedCertificateProps.type}
            onAccept={() => (
              this.handleAction({
                type: ACTIONS_CONST.WS_REMOVE_ITEM,
              })
            )}
            onCancel={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              })
            )}
          />
          <Dialog.IncorrectPinDialog
            name="incorrect_pin"
            onAccept={() => (
              this.handleAction({
                type: 'TRY_AGAIN_LOGIN',
              })
            )}
            onCancel={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              })
            )}
          />
          <Dialog.UnauthorizePinDialog
            name="unauthorize_pin"
            onAccept={() => (
              this.handleAction({
                type: 'TRY_AGAIN_PIN',
              })
            )}
          />
          <Dialog.NotSupportedLocalhostDialog
            name="not_supported_localhost"
          />
          <Dialog.RequestCreateErrorDialog
            name="request_create_error"
            message={message}
            onAccept={() => {
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              });
            }}
          />
          <Dialog.CertificateImportErrorDialog
            message={message}
            name="certificate_import_error"
            onAccept={() => {
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              });
            }}
          />
          <Dialog.LoadDialog
            name="load"
          />
          <Dialog.FortifyAuthorizationDialog
            name="fortify_authorization"
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
