import WS from './crypto';
import Error from './error';
import App from './app';

export default function* () {
  yield [
    App(),
    WS(),
    Error(),
  ];
}
