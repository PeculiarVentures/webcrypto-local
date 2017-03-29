/* eslint no-undef: 0 */
import { SERVER_URL } from '../../../scripts/config';

export const ws = new WebcryptoSocket.SocketProvider();

export function wsConnect(onListening) {
  ws.connect(SERVER_URL)
    .on('error', (e) => {
      console.error('Connected error', e.error);
    })
    .on('listening', onListening)
    .on('close', () => {
      console.info('close');
    });
}

window.ws = ws;
window.wsConnect = wsConnect;
