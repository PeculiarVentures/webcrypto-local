import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { ws, WSController } from '../../controllers/webcrypto_socket';
import { EventChannel } from '../../controllers';
import { ACTIONS_CONST } from '../../constants';
import { AppActions, CertificateActions, ErrorActions } from '../../actions/state';
import { RoutingActions } from '../../actions/ui';
import * as Key from './key';
import * as Certificate from './certificate';
import { ab2hex, downloadCertFromURI, copyTextToBuffer } from '../../helpers';

function* getProviders() {
  const info = yield ws.info();
  return info.providers;
}

function* getCrypto(providerId = 0) {
  try {
    const providers = yield getProviders();
    const provider = providers[providerId];
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
      const keyData = WSController.keyDataHandler(key, keyId);
      yield put(CertificateActions.add(keyData));
    }
  }
}

function* getCerificates({ providerId }) {
  const providers = yield getProviders();

  // TODO: 'for' created for test
  for (let i = 0; i < providers.length; i += 1) {
    const crypto = yield getCrypto(i);
    const certificates = yield Certificate.getCertificates(crypto);
    if (certificates.length) {
      // const getCertificatesArr = [];
      // for (const certId of certificates) {
      //   getCertificatesArr.push(Certificate.getCertificate(crypto, certId));
      // }
      //
      // const certificatesArr = yield getCertificatesArr;
      // for (const certificate of certificatesArr) {
      //   const certData = WSController.certDataHandler(certificate);
      //   yield put(CertificateActions.add(certData));
      // }
      for (const certId of certificates) {
        const certificate = yield Certificate.getCertificate(crypto, certId);
        // let x = crypto.certStorage.exportCert('pem', certificate);
        // console.log(yield x);
        // const raw = ab2hex(yield x);
        // downloadCertificate('test', yield x);
        const certData = WSController.certDataHandler(certificate, certId);
        yield put(CertificateActions.add(certData));
      }
    }
  }
  yield put(AppActions.dataLoaded(true));
}

function* createCertificate({ providerId, data }) {
  const crypto = yield getCrypto(providerId);
  const certId = yield Certificate.createCertificate(crypto, data);
  if (certId) {
    const certificate = yield Certificate.getCertificate(crypto, certId);
    const certData = WSController.certDataHandler(certificate, certId);
    yield put(CertificateActions.add(certData));
    yield put(RoutingActions.push(`certificate/${certificate.id}`));
  }
}

function* removeItem({ providerId }) {
  const crypto = yield getCrypto(providerId);
  const state = yield select();
  const certStorage = state.find('certificates').where({ selected: true }).get();
  if (crypto) {
    let remove = '';
    if (certStorage.type === 'key') {
      remove = yield Key.removeKey(crypto, certStorage._id);
    } else {
      remove = yield Certificate.removeCertificate(crypto, certStorage._id);
    }
    if (remove) {
      yield put(CertificateActions.remove(certStorage.id));
    }
  }
}

function* downloadCertificate({ providerId, format }) {
  const crypto = yield getCrypto(providerId);
  const state = yield select();
  const certStorage = state.find('certificates').where({ selected: true }).get();
  if (crypto) {
    const cert = yield Certificate.exportCertificate(crypto, certStorage._id, format);
    if (cert && typeof cert === 'string') {
      downloadCertFromURI(certStorage.name, cert);
    } else if (cert) {
      const certHex = ab2hex(cert);
      downloadCertFromURI(certStorage.name, certHex);
    }
  }
}

function* copyCertificateToBuffer({ providerId, format }) {
  const crypto = yield getCrypto(providerId);
  const state = yield select();
  const certStorage = state.find('certificates').where({ selected: true }).get();
  if (crypto) {
    const cert = yield Certificate.exportCertificate(crypto, certStorage._id, format);
    if (cert && typeof cert === 'string') {
      copyTextToBuffer(cert);
    } else if (cert) {
      const certHex = ab2hex(cert);
      copyTextToBuffer(certHex);
    }
    EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'copied', 4000);
  }
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_CERTIFICATES, getCerificates),
    takeEvery(ACTIONS_CONST.WS_CREATE_CSR, createCertificate),
    takeEvery(ACTIONS_CONST.WS_REMOVE_ITEM, removeItem),
    takeEvery(ACTIONS_CONST.WS_DOWNLOAD_CERTIFICATE, downloadCertificate),
    takeEvery(ACTIONS_CONST.WS_COPY_CERTIFICATE, copyCertificateToBuffer),
  ];
}
