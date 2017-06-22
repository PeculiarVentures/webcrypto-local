import React, { Component } from 'react';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

export default class NotSupportedLocalhostDialog extends Component {

  render() {
    return (
      <Dialog
        title={enLang['Dialog.NotSupportedLocalhost.Title']}
        acceptText=""
        cancelText=""
      />
    );
  }
}
