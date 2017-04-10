import { takeEvery } from 'redux-saga';
import { select, put } from 'redux-saga/effects';
import { ws, WSController } from '../../controllers/webcrypto_socket';
import { EventChannel } from '../../controllers';
import { ACTIONS_CONST } from '../../constants';
import { AppActions, CertificateActions, ErrorActions, ProviderActions } from '../../actions/state';
import { RoutingActions, ModalActions } from '../../actions/ui';
import { downloadCertFromURI, CertHelper } from '../../helpers';
import * as Key from './key';
import * as Certificate from './certificate';

function* getProvidersList() {
  const info = yield ws.info();
  return info.providers;
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
      yield crypto.login();
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
    yield put(AppActions.dataLoaded(true));
  }
}

function* getCerificates() {
  const crypto = yield getCrypto();
  if (crypto) {
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
        const item = yield Certificate.getCertificate(crypto, certId);
        let certData = '';

        if (item.type === 'x509') {
          const certificateRaw = yield crypto.certStorage.exportCert('raw', item);
          const certificateDetails = CertHelper.certRawToJson(certificateRaw);
          certData = WSController.certDataHandler(certificateDetails, item, certId);
        } else {
          certData = WSController.requestDataHandler(item, certId);
        }

        yield put(CertificateActions.add(certData));
      }
    }
    yield put(AppActions.dataLoaded(true));
  }
}

function* createCertificate({ data }) {
  const crypto = yield getCrypto();
  const certId = yield Certificate.createCertificate(crypto, data);
  if (certId) {
    const item = yield Certificate.getCertificate(crypto, certId);
    const certData = WSController.requestDataHandler(item, certId);
    yield put(CertificateActions.add(certData));
    yield put(RoutingActions.push(`certificate/${item.id}`));
  }
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

function* openModalForCopy({ value }) {
  if (value === 'copy_certificate') {
    const crypto = yield getCrypto();
    const state = yield select();
    const certStorage = state.find('certificates').where({ selected: true }).get();
    if (crypto) {
      const arrRequest = [
        Certificate.exportCertificate(crypto, certStorage._id, 'pem'),
        Certificate.exportCertificate(crypto, certStorage._id, 'raw'),
      ];
      const arrFormats = yield arrRequest;
      const formats = {
        pem: arrFormats[0],
        der: CertHelper.formatDer(CertHelper.ab2hex(arrFormats[1])),
      };
      EventChannel.emit(ACTIONS_CONST.CERTIFICATE_COPIED_DATA, formats);
    }
  }
}

function* getProviders() {
  try {
    const providers = yield getProvidersList();
    const _providers = [];
    providers.map((prv, index) => (
      _providers.push({
        id: prv.id,
        name: prv.name,
        readOnly: prv.readOnly,
        index,
      })
    ));
    yield put(ProviderActions.updateProviders(_providers));
    yield put(ProviderActions.select(_providers[0].id));
  } catch (error) {
    yield put(ErrorActions.error(error));
  }
  return false;
}

function* importCertificate({ data }) {
  const crypto = yield getCrypto();
  const certId = yield Certificate.importCertificate(crypto, data);
  if (certId) {
    const item = yield Certificate.getCertificate(crypto, certId);
    let certData = '';

    if (item.type === 'x509') {
      const certificateRaw = yield crypto.certStorage.exportCert('raw', item);
      const certificateDetails = CertHelper.certRawToJson(certificateRaw);
      certData = WSController.certDataHandler(certificateDetails, item, certId);
    } else {
      certData = WSController.requestDataHandler(item, certId);
    }

    yield put(CertificateActions.add(certData));
    yield put(ModalActions.closeModal());
    yield put(CertificateActions.select(item.id));
  }
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_CERTIFICATES, getCerificates),
    takeEvery(ACTIONS_CONST.WS_CREATE_CSR, createCertificate),
    takeEvery(ACTIONS_CONST.WS_REMOVE_ITEM, removeItem),
    takeEvery(ACTIONS_CONST.WS_DOWNLOAD_CERTIFICATE, downloadCertificate),
    takeEvery(ACTIONS_CONST.MODAL_OPEN, openModalForCopy),
    takeEvery(ACTIONS_CONST.WS_GET_PROVIDERS, getProviders),
    takeEvery(ACTIONS_CONST.WS_IMPORT_CERTIFICATE, importCertificate),
  ];
}
