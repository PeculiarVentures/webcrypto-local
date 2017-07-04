import React, { Component } from 'react';
import { Dialog } from '../basic';
import enLang from '../../langs/en.json';

export default class EmptyProviders extends Component {

  render() {
    return (
      <Dialog
        title={enLang['Dialog.EmptyProviders.Title']}
        acceptText=""
        cancelText=""
      />
    );
  }
}
