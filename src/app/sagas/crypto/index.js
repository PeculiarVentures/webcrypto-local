import { takeEvery } from 'redux-saga';
import { select, put, spawn } from 'redux-saga/effects';
import { ws } from '../../controllers/webcrypto_socket';
import { ACTIONS_CONST } from '../../constants';
import { AppActions, CertificateActions, ErrorActions, ProviderActions } from '../../actions/state';
import { RoutingActions, ModalActions, DialogActions } from '../../actions/ui';
import { downloadCertFromURI, CertHelper } from '../../helpers';
import * as Key from './key';
import * as Certificate from './certificate';
import { EventChannel } from '../../controllers';

function* cryptoLogin(crypto) {
  try {
    yield crypto.login();
    const state = yield select();
    const selectedProvider = state.find('providers').where({ selected: true }).get();
    yield put(ProviderActions.add({
      id: selectedProvider.id,
      logged: true,
    }));
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
}

function* getProvidersList() {
  let info = [];
  try {
    info = yield ws.info();
    info = info.providers;
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return info;
}

function* getCrypto() {
  const state = yield select();
  const selectedProvider = state.find('providers').where({ selected: true }).get();
  try {
    const providers = yield getProvidersList();
    const provider = providers[selectedProvider.index];
    const crypto = yield ws.getCrypto(provider.id);
    const isLoggedIn = yield crypto.isLoggedIn();
    if (!isLoggedIn) {
      yield spawn(cryptoLogin, crypto);
    }
    return crypto;
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}

function* getKeys() {
  const crypto = yield getCrypto();
  const keys = yield Key.getKeys(crypto);
  if (keys.length) {
    const getKeysArr = [];
    for (const keyId of keys) {
      getKeysArr.push(Key.getKey(crypto, keyId));
    }

    let index = 0;
    const keysArr = yield getKeysArr;
    for (const key of keysArr) {
      const keyData = CertHelper.keyDataHandler(key, keys[index]);
      yield put(CertificateActions.add(keyData));
      index += 1;
    }

    yield put(AppActions.dataLoaded(true));
  }
}

function* getCerificates() {
  const crypto = yield getCrypto();

  if (crypto) {
    const certificates = yield Certificate.getCertificates(crypto);

    if (certificates.length) {
      const getCertificatesArr = [];
      let index = 0;

      for (const certId of certificates) {
        getCertificatesArr.push(Certificate.getCertificate(crypto, certId));
      }

      const certificatesArr = yield getCertificatesArr;

      for (const item of certificatesArr) {
        const pem = yield crypto.certStorage.exportCert('pem', item);
        let certData = '';

        if (item.type === 'x509') {
          const certificateRaw = yield crypto.certStorage.exportCert('raw', item);
          const certificateDetails = CertHelper.certRawToJson(certificateRaw);

          certData = CertHelper.certDataHandler(certificateDetails, item, certificates[index], pem);
        } else {
          certData = CertHelper.requestDataHandler(item, certificates[index], pem);
        }

        index += 1;
        yield put(CertificateActions.add(certData));
      }
    }
    yield put(AppActions.dataLoaded(true));
  }
}

function* createCertificate({ data }) {
  yield put(DialogActions.open('load'));
  const crypto = yield getCrypto();
  const certId = yield Certificate.createCertificate(crypto, data);
  if (certId) {
    const item = yield Certificate.getCertificate(crypto, certId);
    const pem = yield crypto.certStorage.exportCert('pem', item);
    const certData = CertHelper.requestDataHandler(item, certId, pem);

    yield put(CertificateActions.add(certData));
    yield put(RoutingActions.push(`certificate/${item.id}`));
  }
  yield put(DialogActions.close());
}

function* removeItem() {
  const crypto = yield getCrypto();
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

function* downloadCertificate({ format }) {
  const crypto = yield getCrypto();
  const state = yield select();
  const certStorage = state.find('certificates').where({ selected: true }).get();
  if (crypto) {
    const cert = yield Certificate.exportCertificate(crypto, certStorage._id, format);
    if (cert && typeof cert === 'string') {
      downloadCertFromURI(certStorage.name, cert, certStorage.type);
    } else if (cert) {
      const certHex = CertHelper.formatDer(CertHelper.ab2hex(cert));
      downloadCertFromURI(certStorage.name, certHex, certStorage.type);
    }
  }
}

function* getProviders() {
  const state = yield select();
  const isLoad = state.find('dataLoaded').get();
  const stateProviders = state.find('providers').get();

  try {
    const providers = yield getProvidersList();
    const isRemoved = stateProviders.length > providers.length;
    const isInserted = stateProviders.length < providers.length;
    const _providers = [];

    for (const prv of providers) {
      const crypto = yield ws.getCrypto(prv.id);
      const isLoggedIn = yield crypto.isLoggedIn();

      _providers.push({
        id: prv.id,
        name: prv.name,
        readOnly: prv.readOnly,
        index: _providers.length,
        logged: isLoggedIn,
      });
    }

    if (isRemoved && isLoad) {
      EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'card_removed', 3000);
    }
    if (isInserted && isLoad) {
      EventChannel.emit(ACTIONS_CONST.SNACKBAR_SHOW, 'card_inserted', 3000);
    }
    yield put(ProviderActions.updateProviders(_providers));
    yield put(ProviderActions.select(_providers[0].id, isRemoved));
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}

function* importCertificate({ data }) {
  yield put(DialogActions.open('load'));
  const crypto = yield getCrypto();
  const certId = yield Certificate.importCertificate(crypto, data);

  if (certId) {
    const item = yield Certificate.getCertificate(crypto, certId);
    const pem = yield crypto.certStorage.exportCert('pem', item);
    let certData = '';

    if (item.type === 'x509') {
      const certificateRaw = yield crypto.certStorage.exportCert('raw', item);
      const certificateDetails = CertHelper.certRawToJson(certificateRaw);
      certData = CertHelper.certDataHandler(certificateDetails, item, certId, pem);
    } else {
      certData = CertHelper.requestDataHandler(item, certId, pem);
    }

    yield put(CertificateActions.add(certData));
    yield put(ModalActions.closeModal());
    yield put(DialogActions.close());
    yield put(CertificateActions.select(item.id));
  }
}

function* login() {
  const crypto = yield getCrypto();
  const isLoggedIn = yield crypto.isLoggedIn();

  if (!isLoggedIn) {
    try {
      yield crypto.login();
      const state = yield select();
      const selectedProvider = state.find('providers').where({ selected: true }).get();
      yield put(ProviderActions.add({
        id: selectedProvider.id,
        logged: true,
      }));
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_CERTIFICATES, getCerificates),
    takeEvery(ACTIONS_CONST.WS_CREATE_CSR, createCertificate),
    takeEvery(ACTIONS_CONST.WS_REMOVE_ITEM, removeItem),
    takeEvery(ACTIONS_CONST.WS_DOWNLOAD_CERTIFICATE, downloadCertificate),
    takeEvery(ACTIONS_CONST.WS_GET_PROVIDERS, getProviders),
    takeEvery(ACTIONS_CONST.WS_IMPORT_CERTIFICATE, importCertificate),
    takeEvery(ACTIONS_CONST.WS_LOGIN, login),
  ];
}
