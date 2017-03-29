import WS from './webcrypto';
import Error from './error';

export default function* () {
  yield [
    WS(),
    Error(),
  ];
}
