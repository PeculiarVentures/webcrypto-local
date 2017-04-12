import { put } from 'redux-saga/effects';
import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';
import { ErrorActions } from '../../actions/state';
import { CertHelper } from '../../helpers';

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

export function* exportCertificate(crypto, certId, format = 'pem') {
  if (crypto) {
    try {
      const cert = yield crypto.certStorage.getItem(certId);
      return yield crypto.certStorage.exportCert(format, cert);
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}

export function* importCertificate(crypto, data) {
  if (crypto) {
    try {
      const { raw, usages, type } = data;
      const algorithm = () => Object.assign({}, data.algorithm);
      let importCert = '';

      if (type === 'request') { // check certificate request data
        try {
          importCert = yield crypto.certStorage.importCert('request', raw, algorithm(), usages);
        } catch (error) {
          yield put(ErrorActions.error(error));
        }
      } else { // else certificate
        try {
          importCert = yield crypto.certStorage.importCert('x509', raw, algorithm(), usages);
        } catch (error) {
          yield put(ErrorActions.error(error));
        }
      }

      return yield crypto.certStorage.setItem(importCert);
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}

export function* createCertificate(crypto, data) {
  // const data = {
  //   commonName: 'My cert 6',
  //   hostName: 'domain',
  //   organization: 'OOO Name 4',
  //   organizationUnit: '123',
  //   locality: 'aa3',
  //   country: 'pd3',
  //   state: 'state 1',
  //   keyInfo: {
  //     extractable: false,
  //     algorithm: {
  //       name: 'RSASSA-PKCS1-v1_5',
  //       hash: 'SHA-256',
  //       modulusLength: 1024,
  //       publicExponent: new Uint8Array([1, 0, 1]),
  //     },
  //     usages: ['sign', 'verify'],
  //   },
  // };
  if (crypto) {
    const { algorithm, extractable, usages } = data.keyInfo;
    const _algorithm = () => Object.assign({}, algorithm);
    const algorithmHash = algorithm.hash;
    let pkcs10 = new pkijs.CertificationRequest();

    try {
      const {
        publicKey,
        privateKey,
      } = yield crypto.subtle.generateKey(_algorithm(), extractable, usages);
      pkijs.setEngine('Crypto', crypto, crypto.subtle);
      pkcs10.version = 0;
      pkcs10 = CertHelper.decoratePkcs10Subject(pkcs10, data);
      pkcs10.attributes = [];

      yield pkcs10.subjectPublicKeyInfo.importKey(publicKey);

      const hash = yield crypto.subtle.digest(
        { name: algorithmHash },
        pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex,
      );
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

      pkcs10.attributes.push(attribute);
      yield pkcs10.sign(privateKey, privateKey.algorithm.hash ? privateKey.algorithm.hash.name : 'SHA-1');

      const csrBuffer = pkcs10.toSchema().toBER(false);

      let importCert = '';
      try {
        importCert = yield crypto.certStorage.importCert('request', csrBuffer, _algorithm(), usages);
      } catch (error) {
        yield put(ErrorActions.error(error, 'request_create'));
      }

      const certId = yield crypto.certStorage.setItem(importCert);
      yield crypto.keyStorage.setItem(privateKey);
      yield crypto.keyStorage.setItem(publicKey);
      return certId;
    } catch (error) {
      yield put(ErrorActions.error(error, 'request_create'));
    }
  }
  return false;
}

export function* removeCertificate(crypto, certId) {
  if (crypto) {
    try {
      yield crypto.certStorage.removeItem(certId);
      return true;
    } catch (error) {
      yield put(ErrorActions.error(error));
    }
  }
  return false;
}
