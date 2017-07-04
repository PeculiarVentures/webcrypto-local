import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';
import enLang from '../../langs/en.json';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class RemoveItemErrorDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    certificateName: PropTypes.string,
    certificateType: PropTypes.string,
    message: PropTypes.string,
  };

  static defaultProps = {
    certificateName: '',
    certificateType: '',
    message: '',
  };

  constructor() {
    super();
    this.unbind = () => {};
  }

  componentDidMount() {
    const { onCancel } = this.props;
    QShortcuts.on('ESCAPE', onCancel);

    this.unbind = () => {
      QShortcuts.off('ESCAPE', onCancel);
    };
  }

  componentWillUnmount() {
    this.unbind();
  }

  getTypeText() {
    const { certificateType } = this.props;

    switch (certificateType) {
      case 'certificate':
        return enLang['Dialog.RemoveCertificate.Type.Certificate'];

      case 'request':
        return enLang['Dialog.RemoveCertificate.Type.Request'];

      case 'key':
        return enLang['Dialog.RemoveCertificate.Type.Key'];

      default:
        return null;
    }
  }

  render() {
    const { onAccept, onCancel, certificateName, message } = this.props;

    return (
      <Dialog
        title={`${enLang['Dialog.RemoveCertificateError.Title']} ${this.getTypeText()} "${certificateName}"`}
        acceptText={enLang['Dialog.RemoveCertificateError.Btn.Accept']}
        cancelText={enLang['Dialog.RemoveCertificateError.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      >
        <DescrStyled>
          { message }
        </DescrStyled>
      </Dialog>
    );
  }
}
