/* eslint no-undef: 0 */
import { SERVER_URL } from '../../../scripts/config';
import Store from '../store';
import { WSActions, ErrorActions } from '../actions/state';

export const ws = new WebcryptoSocket.SocketProvider();
window.ws = ws;

export const WSController = {
  interval: null,
  connect: function connect() {
    clearTimeout(this.interval);
    ws.removeAllListeners();

    ws.connect(SERVER_URL)
      .on('error', (error) => {
        clearTimeout(this.interval);
        Store.dispatch(ErrorActions.error(error));
        console.log('WebcryptoSocket connected error: ', error.message);
      })
      .on('listening', () => {
        clearTimeout(this.interval);
        Store.dispatch(WSActions.status('online'));
        Store.dispatch(WSActions.getProviders());
      })
      .on('close', () => {
        Store.dispatch(WSActions.status('offline'));
        // this.checkConnect();
      })
      .on('token', () => {
        clearTimeout(this.interval);
        Store.dispatch(WSActions.getProviders());
      })
      .on('pin', (pin) => {
        console.log(pin);
        // console.log(ws);
        // console.log(pin);
      });
  },

  checkConnect: function checkConnect() {
    this.interval = setTimeout(() => {
      this.connect();
    }, 4000);
  },
};
