/* eslint no-unused-vars: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { objectOmitPluck } from './helpers';
import Routing from './routing';
import Store from './store';
import { wsConnect } from './controllers/webcrypto_socket';

window.Store = Store;
wsConnect(() => {
  Store.dispatch({ type: 'WS:GET_KEYS' });
  // Store.dispatch({ type: 'WS:GET_CERTIFICATES' });
});

ReactDOM.render(<Routing />, document.getElementById('root'));
