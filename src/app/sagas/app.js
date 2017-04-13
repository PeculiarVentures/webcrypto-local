import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { AppActions, WSActions, CertificateActions } from '../actions/state';

function* selectProvider({ id, update }) {
  const state = yield select();
  const provider = state.find('providers').where({ id }).get();
  if (update !== false) {
    yield put(AppActions.dataLoaded(false));
  }
  yield put(AppActions.readState(provider.readOnly));
  yield put(CertificateActions.clear());
  yield put(WSActions.getCertificates());
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.PROVIDER_SELECT, selectProvider),
  ];
}
