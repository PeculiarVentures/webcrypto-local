import React, { Component } from 'react';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

export default class ServerOfflineDialog extends Component {

  render() {
    return (
      <Dialog
        title={enLang['Dialog.ServerOffline.Title']}
        acceptText=""
        cancelText=""
      />
    );
  }
}
