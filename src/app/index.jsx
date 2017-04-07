/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { objectOmitPluck } from './helpers';
import Routing from './routing';
import Store from './store';
import { WSController } from './controllers/webcrypto_socket';
import { WSActions, ProviderActions } from './actions/state';
import { DialogActions } from './actions/ui';

window.Store = Store;

const wsOnListening = () => {
  Store.dispatch(WSActions.status('online'));
  Store.dispatch(WSActions.getProviders());
};

const wsOnError = (error) => {
  console.log('Connected error', error);
  Store.dispatch(WSActions.status('offline'));
};

const wsOnClose = () => {
  Store.dispatch(WSActions.status('offline'));
};

const wsOnToken = () => {
  Store.dispatch(WSActions.getProviders());
};

WSController.connect(wsOnListening, wsOnError, wsOnClose, wsOnToken);

ReactDOM.render(<Routing />, document.getElementById('root'));
