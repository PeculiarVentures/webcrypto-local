import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { AppActions, WSActions, CertificateActions } from '../actions/state';

function* selectProvider({ id }) {
  const state = yield select();
  const provider = state.find('providers').where({ id }).get();
  yield put(AppActions.dataLoaded(false));
  yield put(AppActions.readState(provider.readOnly));
  yield put(CertificateActions.clear());
  yield put(WSActions.getCertificates(provider.index));
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.PROVIDER_SELECT, selectProvider),
  ];
}
