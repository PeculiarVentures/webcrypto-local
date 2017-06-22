import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

export default class UnauthorizePinDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
  };

  render() {
    const { onAccept } = this.props;

    return (
      <Dialog
        title={enLang['Dialog.UnauthorizePin.Title']}
        acceptText={enLang['Dialog.UnauthorizePin.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      />
    );
  }
}
