import { put } from 'redux-saga/effects';
import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';
import { ErrorActions } from '../../actions/state';

const subjectTypesAndValues = {
  commonName: '2.5.4.3',
  hostName: '1.3.6.1.2.1.1.5',
  organization: '2.5.4.10',
  organizationUnit: '2.5.4.11',
  country: '2.5.4.6',
  locality: '2.5.4.7',
  state: '2.5.4.8',
  expirationDate: '2.5.29.22',
  creationDate: '0.2.262.1.10.7.5',
};

const decoratePkcs10Subject = (pkcs10, data) => {
  const _pkcs10 = pkcs10;

  Object.keys(data).map((key) => {
    if ({}.hasOwnProperty.call(subjectTypesAndValues, key)) {
      _pkcs10.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
        type: subjectTypesAndValues[key],
        value: new asn1js.Utf8String({ value: data[key] }),
      }));
    }
    return true;
  });

  return _pkcs10;
};

export function* getCertificates(crypto) {
  if (crypto) {
    return yield crypto.certStorage.keys();
  }
  return [];
}

export function* getCertificate(crypto, certId) {
  if (crypto) {
    try {
      return yield crypto.certStorage.getItem(certId);
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}

export function* createCSR(crypto) {
  const data = {
    commonName: 'My cert 6',
    hostName: 'domain',
    organization: 'OOO Name 4',
    organizationUnit: '123',
    locality: 'aa3',
    country: 'pd3',
    state: 'state 1',
    keyInfo: {
      extractable: false,
      algorithm: {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
      },
      usages: ['sign', 'verify'],
    },
  };

  if (crypto) {
    const { algorithm, extractable, usages } = data.keyInfo;
    let pkcs10 = new pkijs.CertificationRequest();

    try {
      const {
        publicKey,
        privateKey,
      } = yield crypto.subtle.generateKey(algorithm, extractable, usages);

      pkijs.setEngine('Crypto', crypto, crypto.subtle);
      pkcs10.version = 0;
      pkcs10 = decoratePkcs10Subject(pkcs10, data);
      pkcs10.attributes = [];

      yield pkcs10.subjectPublicKeyInfo.importKey(publicKey);

      const hash = yield crypto.subtle.digest({ name: 'SHA-1' }, pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex);
      const attribute = new pkijs.Attribute({
        type: '1.2.840.113549.1.9.14',
        values: [(new pkijs.Extensions({
          extensions: [
            new pkijs.Extension({
              extnID: '2.5.29.14',
              critical: false,
              extnValue: (new asn1js.OctetString({ valueHex: hash })).toBER(false),
            }),
          ],
        })).toSchema()],
      });

      yield pkcs10.attributes.push(attribute);
      yield pkcs10.sign(privateKey);

      const csrBuffer = pkcs10.toSchema().toBER(false);

      let importCert = '';
      try {
        importCert = yield crypto.certStorage.importCert('x509', csrBuffer, algorithm, usages);
      } catch (error) {
        importCert = yield crypto.certStorage.importCert('request', csrBuffer, algorithm, usages);
      }

      yield crypto.certStorage.setItem(importCert);
      yield crypto.keyStorage.setItem(privateKey);
      // yield crypto.keyStorage.setItem(publicKey);
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}
