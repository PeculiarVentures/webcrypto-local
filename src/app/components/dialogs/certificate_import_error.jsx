import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';
import { EventChannel } from '../../controllers';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class CertificateImportErrorDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      message: '',
    };

    EventChannel.once('CERTIFICATE_IMPORT_ERROR_MESSAGE', this.onSetMessage);
  }

  onSetMessage = (message) => {
    if (message) {
      this.setState({
        message,
      });
    }
  };

  render() {
    const { onAccept } = this.props;
    const { message } = this.state;

    return (
      <Dialog
        title={enLang['Dialog.CertificateImportError.Title']}
        acceptText={enLang['Dialog.CertificateImportError.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      >
        <DescrStyled>
          { message }
        </DescrStyled>
      </Dialog>
    );
  }
}
