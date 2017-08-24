import { put } from 'redux-saga/effects';
import CertificationRequest from 'pkijs/build/CertificationRequest';
import Attribute from 'pkijs/build/Attribute';
import Extensions from 'pkijs/build/Extensions';
import Extension from 'pkijs/build/Extension';
import Certificate from 'pkijs/build/Certificate';
import { setEngine } from 'pkijs/build/common';
import * as asn1js from 'asn1js';
import { ErrorActions } from '../../actions/state';
import { CertHelper } from '../../helpers';
import * as Key from './key';

export function* certificateGetIDs(crypto) {
  if (crypto) {
    try {
      return yield crypto.certStorage.keys();
    } catch (error) {
      yield put(ErrorActions.error(error));
      return [];
    }
  }
  return [];
}

export function* certificateSet(crypto, cert) {
  if (crypto) {
    try {
      return yield crypto.certStorage.setItem(cert);
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

export function* certificateGet(crypto, id) {
  if (crypto) {
    try {
      return yield crypto.certStorage.getItem(id);
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

export function* certificateExport(crypto, cert, format = 'pem') {
  if (crypto) {
    try {
      return yield crypto.certStorage.exportCert(format, cert);
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

export function* certificateImport(crypto, data) {
  if (crypto) {
    try {
      const { raw, usages, type } = data;
      const algorithm = () => Object.assign({}, data.algorithm);
      let importCert = '';

      if (type === 'request') { // check certificate request data
        try {
          importCert = yield crypto.certStorage.importCert('request', raw, algorithm(), usages);
        } catch (error) {
          yield put(ErrorActions.error(error, 'import_item'));
        }
      } else { // else certificate
        try {
          importCert = yield crypto.certStorage.importCert('x509', raw, algorithm(), usages);
        } catch (error) {
          yield put(ErrorActions.error(error, 'import_item'));
        }
      }

      return yield certificateSet(crypto, importCert);
    } catch (error) {
      yield put(ErrorActions.error(error, 'import_item'));
      return false;
    }
  }
  return false;
}

export function* certificateCreate(crypto, data) {
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
    const { extractable, usages } = data.keyInfo;
    const algorithm = (() => Object.assign({
      publicExponent: new Uint8Array([1, 0, 1]),
    }, data.keyInfo.algorithm))();
    const algorithmHash = algorithm.hash;
    let pkcs10 = new CertificationRequest();

    try {
      const {
        publicKey,
        privateKey,
      } = yield crypto.subtle.generateKey(algorithm, extractable, usages);

      setEngine('Crypto', crypto, crypto.subtle);
      pkcs10.version = 0;
      pkcs10 = CertHelper.decoratePkcs10Subject(pkcs10, data);
      pkcs10.attributes = [];

      yield pkcs10.subjectPublicKeyInfo.importKey(publicKey);

      const hash = yield crypto.subtle.digest(
        { name: algorithmHash },
        pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex,
      );
      const attribute = new Attribute({
        type: '1.2.840.113549.1.9.14',
        values: [(new Extensions({
          extensions: [
            new Extension({
              extnID: '2.5.29.14',
              critical: false,
              extnValue: (new asn1js.OctetString({ valueHex: hash })).toBER(false),
            }),
          ],
        })).toSchema()],
      });

      pkcs10.attributes.push(attribute);
      // sign
      yield pkcs10.sign(privateKey, privateKey.algorithm.hash ? privateKey.algorithm.hash.name : 'SHA-1');

      const csrBuffer = pkcs10.toSchema().toBER(false);

      let importCert = '';
      try {
        importCert = yield crypto.certStorage.importCert('request', csrBuffer, algorithm, usages);
      } catch (error) {
        yield put(ErrorActions.error(error, 'request_create'));
      }

      const certId = yield certificateSet(crypto, importCert);
      yield Key.keySet(crypto, privateKey);
      yield Key.keySet(crypto, publicKey);
      return certId;
    } catch (error) {
      yield put(ErrorActions.error(error, 'request_create'));
    }
  }
  return false;
}

export function* CMSCreate(crypto, data) {
  if (crypto) {
    const algorithm = (() => Object.assign({
      publicExponent: new Uint8Array([1, 0, 1]),
    }, data.keyInfo.algorithm))();
    const usages = ['sign', 'verify'];

    try {
      // Set engine
      yield setEngine('MsCAPI PKCS#11', crypto, crypto.subtle);

      // Generate key
      const {
        publicKey,
        privateKey,
      } = yield crypto.subtle.generateKey(algorithm, false, usages);

      // Generate new certificate
      let certificate = new Certificate();
      certificate.version = 2;
      certificate.serialNumber = new asn1js.Integer({ value: 1 });

      certificate = CertHelper.decorateCertificateSubject(certificate, data);

      certificate.notBefore.value = new Date();
      certificate.notAfter.value = new Date();
      certificate.notAfter.value.setFullYear(certificate.notAfter.value.getFullYear() + 1);

      certificate.extensions = [];

      // "KeyUsage" extension
      const bitArray = new ArrayBuffer(1);
      const bitView = new Uint8Array(bitArray);
      bitView[0] |= 0x80; // digitalSignature
      const keyUsage = new asn1js.BitString({ valueHex: bitArray });

      certificate.extensions.push(
        new Extension({
          extnID: '2.5.29.15',
          critical: false,
          extnValue: keyUsage.toBER(false),
          parsedValue: keyUsage, // Parsed value for well-known extensions
        }),
      );


      yield certificate.subjectPublicKeyInfo.importKey(publicKey);
      yield certificate.sign(privateKey, 'SHA-256');

      // Convert certificate to DER
      const derCert = certificate.toSchema(true).toBER(false);

      let importCert = '';
      try {
        importCert = yield crypto.certStorage.importCert('x509', derCert, algorithm, usages);
      } catch (error) {
        yield put(ErrorActions.error(error, 'request_create'));
      }

      const certId = yield certificateSet(crypto, importCert);
      yield Key.keySet(crypto, privateKey);
      yield Key.keySet(crypto, publicKey);
      return certId;
    } catch (error) {
      yield put(ErrorActions.error(error, 'request_create'));
    }
  }
  return false;
}

export function* certificateRemove(crypto, id) {
  if (crypto) {
    try {
      yield crypto.certStorage.removeItem(id);
      return true;
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}

export function* certificateThumbprint(crypto, raw) {
  if (crypto) {
    try {
      return yield crypto.subtle.digest('SHA-256', raw);
    } catch (error) {
      yield put(ErrorActions.error(error));
      return false;
    }
  }
  return false;
}
