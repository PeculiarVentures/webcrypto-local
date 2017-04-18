import { put } from 'redux-saga/effects';
import { ws } from '../../controllers/webcrypto_socket';
import { ErrorActions } from '../../actions/state';

export function* providerGetList() {
  try {
    const info = yield ws.info();
    return info.providers;
  } catch (error) {
    yield put(ErrorActions.error(error));
    return [];
  }
  return [];
}

export function* providerIsLogged(crypto) {
  if (crypto) {
    try {
      return yield crypto.isLoggedIn();
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

export function* providerLogin(crypto) {
  if (crypto) {
    try {
      return yield crypto.login();
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

export function* providerGet(id) {
  try {
    const provider = yield ws.getCrypto(id);
    const isLogged = yield providerIsLogged(provider);
    // if (!isLoggedIn) {
    //   yield spawn(providerLogin, crypto);
    // }
    return {
      provider,
      isLogged,
    };
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}
