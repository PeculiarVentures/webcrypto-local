import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';
import enLang from '../../langs/en.json';

export default class IncorrectPinDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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
    const { onAccept, onCancel } = this.props;

    return (
      <Dialog
        title={enLang['Dialog.IncorrectPin.Title']}
        acceptText={enLang['Dialog.IncorrectPin.Btn.Accept']}
        cancelText={enLang['Dialog.IncorrectPin.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }
}
