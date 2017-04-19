import WS from './crypto';
import Error from './error';

export default function* () {
  yield [
    WS(),
    Error(),
  ];
}
