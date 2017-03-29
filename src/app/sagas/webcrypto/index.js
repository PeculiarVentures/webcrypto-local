import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { decodeSubjectString } from '../../helpers';
import { ACTIONS_CONST } from '../../constants';
import { CertificateActions } from '../../actions/state';
import * as Key from './key';
import * as Certificate from './certificate';

const keyDataHandler = keyData => ({
  id: keyData.id,
  algorithm: keyData.algorithm.name,
  usages: keyData.usages,
  name: 'Need key "name"',
  size: keyData.algorithm.modulusLength,
  selected: false,
  createdAt: 'Need key "createdAt"',
  lastUsed: 'Need key "lastUsed"',
  type: 'key',
});

const certDatahandler = (certData) => {
  const decodedSubject = decodeSubjectString(certData.subjectName);
  return Object.assign({
    id: certData.id,
    name: 'Need key "name"',
    selected: false,
    type: 'certificate',
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

function* getKeys({ providerId }) {
  const keys = yield Key.getKeys(providerId);
  if (keys.length) {
    for (const keyId of keys) {
      const key = yield Key.getKey({ providerId, keyId });
      const keyData = keyDataHandler(key);
      yield put(CertificateActions.add(keyData));
    }
  }
}

function* getCerificates({ providerId }) {
  const certificates = yield Certificate.getCertificates(providerId);
  if (certificates.length) {
    for (const certId of certificates) {
      const certificate = yield Certificate.getCertificate({ providerId, certId });
      const certData = certDatahandler(certificate);
      yield put(CertificateActions.add(certData));
    }
  }
}

export default function* () {
  yield [
    takeEvery(ACTIONS_CONST.WS_GET_KEYS, getKeys),
    takeEvery(ACTIONS_CONST.WS_GET_CERTIFICATES, getCerificates),
  ];
}
