import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

export default class TimeoutPinDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
  };

  render() {
    const { onAccept } = this.props;

    return (
      <Dialog
        title={enLang['Dialog.TimeoutPin.Title']}
        acceptText={enLang['Dialog.TimeoutPin.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      />
    );
  }
}
