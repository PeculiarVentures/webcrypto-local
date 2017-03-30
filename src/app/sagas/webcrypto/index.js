import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ws } from '../../controllers/webcrypto_socket';
import { decodeSubjectString } from '../../helpers';
import { ACTIONS_CONST } from '../../constants';
import { CertificateActions, ErrorActions } from '../../actions/state';
import * as Key from './key';
import * as Certificate from './certificate';

const keyDataHandler = keyData => ({
  id: keyData.id,
  algorithm: keyData.algorithm.name,
  usages: keyData.usages,
  name: 'Need key "name"',
  size: keyData.algorithm.modulusLength,
  createdAt: 'Need key "createdAt"',
  lastUsed: 'Need key "lastUsed"',
  type: 'key',
});

const certDataHandler = (certData) => {
  const decodedSubject = decodeSubjectString(certData.subjectName);
  return Object.assign({
    id: certData.id,
    name: 'Need key "name"',
    type: certData.type === 'request' ? 'request' : 'certificate',
    startDate: new Date(certData.notBefore).getTime().toString(),
    expirationDate: new Date(certData.notAfter).getTime().toString(),
    keyInfo: {
      createdAt: 'Need key "createdAt"',
      lastUsed: 'Need key "lastUsed"',
      algorithm: certData.publicKey.algorithm.name,
      size: certData.publicKey.algorithm.modulusLength,
      usages: certData.publicKey.usages,
    },
    hostName: 'Need key "hostName"',
    organization: 'Need key "organization"',
    organizationUnit: 'Need key "organizationUnit"',
    country: 'Need key "country"',
    region: 'Need key "region"',
    city: 'Need key "city"',
  }, decodedSubject);
};

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
    //   getKeysArr.push(Key.getKey({ providerId, keyId }));
    // }
    //
    // const keysArr = yield getKeysArr;
    // for (const key of keysArr) {
    //   const keyData = keyDataHandler(key);
    //   yield put(CertificateActions.add(keyData));
    // }
    for (const keyId of keys) {
      const key = yield Key.getKey(crypto, keyId);
      const keyData = keyDataHandler(key);
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
    //   getCertificatesArr.push(Certificate.getCertificate({ providerId, certId }));
    // }
    //
    // const certificatesArr = yield getCertificatesArr;
    // for (const certificate of certificatesArr) {
    //   const certData = certDataHandler(certificate);
    //   yield put(CertificateActions.add(certData));
    // }
    for (const certId of certificates) {
      const certificate = yield Certificate.getCertificate(crypto, certId);
      const certData = certDataHandler(certificate);
      yield put(CertificateActions.add(certData));
    }
  }
}

function* createCSR({ providerId, data }) {
  const crypto = yield getCrypto(providerId);
  yield Certificate.createCSR(crypto, data);
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_CERTIFICATES, getCerificates),
    takeEvery(ACTIONS_CONST.WS_CREATE_CSR, createCSR),
  ];
}
