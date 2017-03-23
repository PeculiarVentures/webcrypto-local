import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';
import enLang from '../../langs/en.json';

export default class RemoveCertificateDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    certificateName: PropTypes.string,
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

  render() {
    const { onAccept, onCancel, certificateName } = this.props;

    return (
      <Dialog
        title={`${enLang['Dialog.RemoveCertificate.Title']} "${certificateName}"?`}
        acceptText={enLang['Dialog.RemoveCertificate.Btn.Accept']}
        cancelText={enLang['Dialog.RemoveCertificate.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }
}
