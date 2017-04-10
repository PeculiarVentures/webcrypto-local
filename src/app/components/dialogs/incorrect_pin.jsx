import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

export default class IncorrectPinDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
  };

  render() {
    const { onAccept } = this.props;

    return (
      <Dialog
        title={enLang['Dialog.IncorrectPin.Title']}
        acceptText={enLang['Dialog.IncorrectPin.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      />
    );
  }
}
