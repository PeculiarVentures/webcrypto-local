/* eslint no-undef: 0 */
import { SERVER_URL } from '../../../scripts/config';
import Store from '../store';
import { WSActions } from '../actions/state';

export const ws = new WebcryptoSocket.SocketProvider();
window.ws = ws;

export const WSController = {
  interval: null,
  connect: function connect() {
    ws.removeAllListeners('error');
    ws.removeAllListeners('listening');
    ws.removeAllListeners('close');
    ws.removeAllListeners('token');

    ws.connect(SERVER_URL)
      .on('error', (error) => {
        console.log('Connected error', error.message);
        if (error.message === 'Cannot GET response') {
          clearInterval(this.interval);
          this.checkConnect();
        }
        Store.dispatch(WSActions.status('offline'));
      })
      .on('listening', () => {
        clearInterval(this.interval);
        Store.dispatch(WSActions.status('online'));
        Store.dispatch(WSActions.getProviders());
      })
      .on('close', () => {
        Store.dispatch(WSActions.status('offline'));
        this.checkConnect();
      })
      .on('token', () => {
        clearInterval(this.interval);
        Store.dispatch(WSActions.getProviders());
      });
  },

  checkConnect: function checkConnect() {
    this.interval = setInterval(() => {
      this.connect();
    }, 4000);
  },
};
