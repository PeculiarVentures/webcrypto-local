import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';
import enLang from '../../langs/en.json';

export default class RemoveItemDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    certificateName: PropTypes.string,
    certificateType: PropTypes.string,
  };

  static defaultProps = {
    certificateName: '',
    certificateType: '',
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
    const { onAccept, onCancel, certificateName } = this.props;

    return (
      <Dialog
        title={`${enLang['Dialog.RemoveCertificate.Title']} ${this.getTypeText()} "${certificateName}"?`}
        acceptText={enLang['Dialog.RemoveCertificate.Btn.Accept']}
        cancelText={enLang['Dialog.RemoveCertificate.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }
}
