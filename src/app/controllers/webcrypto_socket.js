/* eslint no-undef: 0 */
import { SERVER_URL } from '../../../scripts/config';
import Store from '../store';
import { WSActions, ErrorActions } from '../actions/state';
import { DialogActions } from '../actions/ui';
import { EventChannel } from '../controllers';

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
        this.isLogged();
        // Store.dispatch(WSActions.onListening());
        // Store.dispatch(WSActions.status('online'));
        // Store.dispatch(WSActions.getProviders());
      })
      .on('close', () => {
        // Store.dispatch(WSActions.status('offline'));
        this.checkConnect();
      })
      .on('token', () => {
        clearTimeout(this.interval);
        // Store.dispatch(WSActions.getProviders());
      });
  },

  checkConnect: function checkConnect() {
    this.interval = setTimeout(() => {
      this.connect();
    }, 4000);
  },

  isLogged: function isLogged() {
    ws.isLoggedIn()
      .then((ok) => {
        if (!ok) {
          ws.challenge()
            .then((pin) => {
              EventChannel.emit('DIALOG:SET_MESSAGE', pin);
              Store.dispatch(DialogActions.open('fortify_authorization'));
            });
          return ws.login();
        }
      })
      .then(() => {
        Store.dispatch(DialogActions.close());
        Store.dispatch(WSActions.onListening());
      })
      .catch((error) => {
        Store.dispatch(ErrorActions.error(error));
      });
  },
};
