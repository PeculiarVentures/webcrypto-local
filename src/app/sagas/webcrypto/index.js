import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ws, WSController } from '../../controllers/webcrypto_socket';
import { ACTIONS_CONST } from '../../constants';
import { AppActions, CertificateActions, ErrorActions } from '../../actions/state';
import { RoutingActions } from '../../actions/ui';
import * as Key from './key';
import * as Certificate from './certificate';

function* getCrypto(providerId = 0) {
  try {
    const info = yield ws.info();
    const provider = info.providers[providerId];
    const crypto = yield ws.getCrypto(provider.id);
    const isLoggedIn = yield crypto.isLoggedIn();
    if (!isLoggedIn) {
      yield crypto.login();
    }
    return crypto;
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}

function* getKeys({ providerId }) {
  const crypto = yield getCrypto(providerId);
  const keys = yield Key.getKeys(crypto);
  if (keys.length) {
    // const getKeysArr = [];
    // for (const keyId of keys) {
    //   getKeysArr.push(Key.getKey(crypto, keyId));
    // }
    //
    // const keysArr = yield getKeysArr;
    // for (const key of keysArr) {
    //   const keyData = keyDataHandler(key);
    //   yield put(CertificateActions.add(keyData));
    // }
    for (const keyId of keys) {
      const key = yield Key.getKey(crypto, keyId);
      const keyData = WSController.keyDataHandler(key);
      yield put(CertificateActions.add(keyData));
    }
  }
}

function* getCerificates({ providerId }) {
  const crypto = yield getCrypto(providerId);
  const certificates = yield Certificate.getCertificates(crypto);
  if (certificates.length) {
    // const getCertificatesArr = [];
    // for (const certId of certificates) {
    //   getCertificatesArr.push(Certificate.getCertificate(crypto, certId));
    // }
    //
    // const certificatesArr = yield getCertificatesArr;
    // for (const certificate of certificatesArr) {
    //   const certData = certDataHandler(certificate);
    //   yield put(CertificateActions.add(certData));
    // }
    for (const certId of certificates) {
      const certificate = yield Certificate.getCertificate(crypto, certId);
      const certData = WSController.certDataHandler(certificate);
      yield put(CertificateActions.add(certData));
    }
    yield put(AppActions.dataLoaded(true));
  }
}

function* createCSR({ providerId, data }) {
  const crypto = yield getCrypto(providerId);
  const certId = yield Certificate.createCSR(crypto, data);
  if (certId) {
    const certificate = yield Certificate.getCertificate(crypto, certId);
    const certData = WSController.certDataHandler(certificate);
    yield put(CertificateActions.add(certData));
    yield put(RoutingActions.push(`certificate/${certificate.id}`));
  }
}

function* removeCSR({ providerId, certId }) {
  const crypto = yield getCrypto(providerId);
  if (crypto) {
    yield Certificate.removeCSR(crypto, certId);
  }
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_CERTIFICATES, getCerificates),
    takeEvery(ACTIONS_CONST.WS_CREATE_CSR, createCSR),
    takeEvery(ACTIONS_CONST.WS_REMOVE_CSR, removeCSR),
  ];
}
