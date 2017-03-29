/* eslint no-undef: 0 */
import { SERVER_URL } from '../../../scripts/config';

export const ws = new WebcryptoSocket.SocketProvider();

export function wsConnect() {
  ws.connect(SERVER_URL)
    .on('error', (e) => {
      console.error(e.error);
    })
    .on('listening', () => {
      console.log('listening', SERVER_URL);
    })
    .on('close', () => {
      console.info('close');
    });
}

window.ws = ws;
window.wsConnect = wsConnect;
