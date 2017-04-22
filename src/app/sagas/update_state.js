import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { ACTIONS_CONST } from '../constants';
import { AppActions, ProviderActions, ItemActions } from '../actions/state';
// import { ProviderActions } from '../actions/state';

function* processCreate(create) {
  yield put(AppActions.setState({
    create: create || false,
  }));

  if (!create) {
    return true;
  }

  return false;
}

function* processCertificate(id) {
  if (!id) {
    return false;
  }
  yield put(ItemActions.select(id));
  return false;
}

function* processRequest(id) {
  if (!id) {
    return false;
  }
  yield put(ItemActions.select(id));
  return false;
}

function* processKey(id) {
  if (!id) {
    return false;
  }
  yield put(ItemActions.select(id));
  return false;
}

function* loadState(payload) {
  const state = yield select();

  const {
    request,
    certificate,
    key,
    params = {},
    create,
  } = payload.state;

  params.provider = params.provider || state.find('providers').get()[0].id;

  // yield put(ProviderActions.select(params.provider));

  let end;

  end = yield processCreate(create);

  if (!end) {
    end = yield processCertificate(certificate);
  }

  if (!end) {
    end = yield processRequest(request);
  }

  if (!end) {
    end = yield processKey(key);
  }

  return false;
}

export default function* () {
  yield [
    yield takeEvery(ACTIONS_CONST.APP_STATE_FROM_ROUTE, loadState),
  ];
}
