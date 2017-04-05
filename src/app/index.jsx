/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { objectOmitPluck } from './helpers';
import Routing from './routing';
import Store from './store';
import { WSController } from './controllers/webcrypto_socket';
import { WSActions } from './actions/state';
import { DialogActions } from './actions/ui';

window.Store = Store;

const wsOnListening = () => {
  Store.dispatch(WSActions.status('online'));
  Store.dispatch(WSActions.getProviders());
  Store.dispatch(DialogActions.open('select_provider'));
};

const wsOnError = (error) => {
  console.log('Connected error', error);
  Store.dispatch(WSActions.status('offline'));
};

const wsOnClose = () => {
  Store.dispatch(WSActions.status('offline'));
};

WSController.connect(wsOnListening, wsOnError, wsOnClose);

ReactDOM.render(<Routing />, document.getElementById('root'));
