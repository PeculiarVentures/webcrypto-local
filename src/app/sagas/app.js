import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { WSActions } from '../actions/state';
import { DialogActions } from '../actions/ui';

function* selectProvider({ id }) {
  const state = yield select();
  const provider = state.find('providers').where({ id }).get();
  yield put(DialogActions.close());
  yield put(WSActions.getCertificates(provider.index));
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.PROVIDER_SELECT, selectProvider),
  ];
}
