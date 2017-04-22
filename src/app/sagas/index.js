import WS from './crypto';
import Error from './error';
// import UpdateState from './update_state';

export default function* () {
  yield [
    WS(),
    Error(),
    // UpdateState(),
  ];
}
