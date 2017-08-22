import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import moment from 'moment';
import UUID from 'uuid';
import { Convert } from 'pvtsutils';
import { OIDS } from '../constants';
import { regExps } from '../helpers';

window.Convert = Convert;

const OID = {
  '2.5.4.3': {
    short: 'CN',
    long: 'CommonName',
  },
  '2.5.4.6': {
    short: 'C',
    long: 'Country',
  },
  '2.5.4.5': {
    long: 'DeviceSerialNumber',
  },
  '0.9.2342.19200300.100.1.25': {
    short: 'DC',
    long: 'DomainComponent',
  },
  '1.2.840.113549.1.9.1': {
    short: 'E',
    long: 'EMail',
  },
  '2.5.4.42': {
    short: 'G',
    long: 'GivenName',
  },
  '2.5.4.43': {
    short: 'I',
    long: 'Initials',
  },
  '2.5.4.7': {
    short: 'L',
    long: 'Locality',
  },
  '2.5.4.10': {
    short: 'O',
    long: 'Organization',
  },
  '2.5.4.11': {
    short: 'OU',
    long: 'OrganizationUnit',
  },
  '2.5.4.8': {
    short: 'ST',
    long: 'State',
  },
  '2.5.4.9': {
    short: 'Street',
    long: 'StreetAddress',
  },
  '2.5.4.4': {
    short: 'SN',
    long: 'SurName',
  },
  '2.5.4.12': {
    short: 'T',
    long: 'Title',
  },
  '1.2.840.113549.1.9.8': {
    long: 'UnstructuredAddress',
  },
  '1.2.840.113549.1.9.2': {
    long: 'UnstructuredName',
  },
};

const subjectTypesAndValues = {
  commonName: '2.5.4.3',
  hostName: '1.3.6.1.2.1.1.5',
  organization: '2.5.4.10',
  organizationUnit: '2.5.4.11',
  country: '2.5.4.6',
  locality: '2.5.4.7',
  state: '2.5.4.8',
};

const subjectNames = {
  O: 'Organization',
  CN: 'Common Name',
  C: 'Country',
  OU: 'Organization Unit',
  L: 'City',
  ST: 'Region',
  E: 'Email',
  G: 'Given Name',
  SN: 'Surname',
  '1.3.6.1.2.1.1.5': 'Host Name',
};

const CertHelper = {
  name2str: function name2str(name, splitter) {
    splitter = splitter || ',';
    const res = [];
    name.typesAndValues.forEach((typeValue) => {
      const type = typeValue.type;
      const oidValue = OID[type.toString()];
      const oidName = oidValue && oidValue.short ? oidValue.short : type.toString();
      res.push(`${oidName}=${typeValue.value.valueBlock.value}`);
    });
    return res.join(`${splitter} `);
  },

  formatDer: function formatDer(string) {
    return string.replace(/(.{32})/g, '$1 \n').replace(/(.{4})/g, '$1 ').trim();
  },

  getKeyType: function getKeyType(algorithm) {
    if (algorithm.slice(0, 3) === 'RSA') {
      return 'RSA';
    }
    if (algorithm.slice(0, 2) === 'EC') {
      return 'EC';
    }
    return algorithm;
  },

  prepareAlgorithm: function prepareAlgorithm(pkiAlg) {
    switch (pkiAlg.algorithmId) {
      case '1.2.840.113549.1.1.5': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' };
      }
      case '1.2.840.113549.1.1.11': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
      }
      case '1.2.840.113549.1.1.12': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' };
      }
      case '1.2.840.113549.1.1.13': {
        return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' };
      }
      case '1.2.840.10045.4.3.2': {
        return { name: 'ECDSA', hash: 'SHA-256' };
      }
      case '1.2.840.10045.4.1': {
        return { name: 'ECDSA', hash: 'SHA-1' };
      }
      default: {
        return { name: pkiAlg.algorithmId };
      }
    }
  },

  addSpaceAfterSecondCharset: function addSpaceAfterSecondCharset(string) {
    return string.replace(/(.{2})/g, '$1 ').trim().toUpperCase();
  },

  certRawToJson: function certRawToJson(raw) {
    const asn1 = asn1js.fromBER(raw);
    const x509 = new pkijs.Certificate({ schema: asn1.result });
    const json = x509.toJSON();

    // Public Key
    const publicKey = {
      algorithm: {
        name: json.subjectPublicKeyInfo.kty,
      },
      value: this.addSpaceAfterSecondCharset(
        Convert.ToHex(x509.subjectPublicKeyInfo.subjectPublicKey.valueBeforeDecode)
      ),
    };

    const { modulus, publicExponent } = x509.subjectPublicKeyInfo.parsedKey;
    // Add params for Public key
    if (publicKey.algorithm.name === 'RSA') {
      publicKey.algorithm.modulusBits = modulus.valueBlock.valueHex.byteLength << 3;
      publicKey.algorithm.publicExponent = publicExponent.valueBlock.valueHex.byteLength === 3
        ? 65537
        : 3;
    } else if (publicKey.algorithm.name === 'EC') {
      publicKey.algorithm.namedCurve = json.subjectPublicKeyInfo.crv;
    }

    // Extensions
    const extensions = [];

    if (json.extensions) {
      for (const item of json.extensions) {
        extensions.push({
          name: OIDS[item.extnID] || item.extnID,
          critical: item.critical || false,
          value: this.addSpaceAfterSecondCharset(item.extnValue.valueBlock.valueHex),
        });
      }
    }

    return {
      version: x509.version,
      serialNumber: this.addSpaceAfterSecondCharset(json.serialNumber.valueBlock.valueHex),
      notBefore: x509.notBefore.value,
      notAfter: x509.notAfter.value,
      issuerName: this.name2str(x509.issuer),
      subjectName: this.name2str(x509.subject),
      publicKey,
      extensions,
      signature: {
        algorithm: this.prepareAlgorithm(json.signature),
        value: this.addSpaceAfterSecondCharset(json.signatureValue.valueBlock.valueHex),
      },
    };
  },

  prepareCertToImport: function prepareCertToImport(value) {
    let certBuf = '';

    if (regExps.base64.test(value)) { // check pem
      value = value.replace(/(-----(BEGIN|END) CERTIFICATE( REQUEST|)-----|\r|\n)/g, '');
      certBuf = Convert.FromBinary(window.atob(value));
    } else { // else der
      value = Convert.FromHex(value.replace(/(\r|\n|\s)/g, ''));
      certBuf = value;
    }

    const asn1 = asn1js.fromBER(certBuf);
    if (asn1.offset > 0) {
      let cert = '';
      let type = '';

      try {
        cert = new pkijs.Certificate({ schema: asn1.result });
        type = 'certificate';
      } catch (_error) {
        try {
          cert = new pkijs.CertificationRequest({ schema: asn1.result });
          type = 'request';
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      const json = cert.toJSON();
      const algorithm = this.prepareAlgorithm(json.signature);
      const { modulus, publicExponent } = cert.subjectPublicKeyInfo.parsedKey;

      const algName = json.subjectPublicKeyInfo.kty;
      if (algName === 'RSA') {
        algorithm.name = 'RSASSA-PKCS1-v1_5';
        algorithm.modulusBits = modulus.valueBlock.valueHex.byteLength << 3;
        algorithm.publicExponent = publicExponent.valueBlock.valueHex;
      } else if (algName === 'EC') {
        algorithm.name = 'ECDSA';
        algorithm.namedCurve = json.subjectPublicKeyInfo.crv;
      }

      return {
        type,
        raw: certBuf,
        usages: ['verify'],
        algorithm: {
          ...algorithm,
        },
      };
    }
    console.error('asn1 fromBER error');
    return false;
  },

  decoratePkcs10Subject: function decoratePkcs10Subject(pkcs10, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key) && data[key]) {
        pkcs10.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.Utf8String({ value: data[key] }),
        }));
      }
      return true;
    });
    return pkcs10;
  },

  decorateCertificateSubject: function decorateCertificateSubject(certificate, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key) && data[key]) {
        certificate.issuer.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.BmpString({ value: data[key] }),
        }));
        certificate.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.BmpString({ value: data[key] }),
        }));
      }
      return true;
    });
    return certificate;
  },

  keyDataHandler: function keyDataHandler(data) {
    const { _algorithm, _usages, id } = data;

    let publicExponent = '';

    if (_algorithm.publicExponent && _algorithm.publicExponent.byteLength) {
      publicExponent = _algorithm.publicExponent.byteLength === 3 ? 65537 : 3;
    }

    return {
      id: UUID(),
      _id: id,
      usages: _usages,
      name: '',
      type: 'key',
      publicExponent,
      algorithm: _algorithm.name,
      modulusLength: _algorithm.modulusLength,
      namedCurve: _algorithm.namedCurve,
    };
  },

  certDataHandler: function certDataHandler(data) {
    // console.log('sdsds', data);
    const lang = navigator.language;
    const {
      issuerName,
      subjectName,
      extensions,
      publicKey,
      version,
      signature,
      serialNumber,
      notBefore,
      notAfter,
      id,
      thumbprint,
      pem,
      addedId,
    } = data;

    const decodedIssuer = this.decodeSubjectString(issuerName);
    const decodedSubject = this.decodeSubjectString(subjectName);
    const name = decodedSubject['Common Name']
      || decodedSubject['Email']
      || decodedSubject['Surname']
      || decodedSubject['Organization']
      || decodedSubject['Organization Unit']
      || '';

    return {
      id: addedId || UUID(),
      _id: id,
      type: 'certificate',
      name,
      pem,
      general: {
        serialNumber,
        version,
        notBefore: notBefore ? moment(notBefore).locale(lang).format('LLLL') : '',
        notAfter: notAfter ? moment(notAfter).locale(lang).format('LLLL') : '',
        thumbprint: this.addSpaceAfterSecondCharset(Convert.ToHex(thumbprint)),
      },
      issuer: decodedIssuer,
      subject: decodedSubject,
      publicKey: {
        publicExponent: publicKey.algorithm.publicExponent,
        value: publicKey.value,
        algorithm: publicKey.algorithm.name,
        modulusBits: publicKey.algorithm.modulusBits,
        namedCurve: publicKey.algorithm.namedCurve,
      },
      signature: {
        algorithm: signature.algorithm.name,
        hash: signature.algorithm.hash,
        value: signature.value,
      },
      extensions,
    };
  },

  requestDataHandler: function requestDataHandler(data) {
    const { _publicKey, id, _subjectName, pem, addedId } = data;
    const { algorithm, raw } = _publicKey;

    const decodedSubject = this.decodeSubjectString(_subjectName);
    let publicExponent = '';

    if (algorithm.publicExponent && algorithm.publicExponent.byteLength) {
      publicExponent = algorithm.publicExponent.byteLength === 3 ? 65537 : 3;
    }
    const name = decodedSubject['Common Name']
      || decodedSubject['Email']
      || decodedSubject['Surname']
      || decodedSubject['Organization']
      || decodedSubject['Organization Unit']
      || '';

    return {
      id: addedId || UUID(),
      _id: id,
      name,
      type: 'request',
      pem,
      subject: decodedSubject,
      publicKey: {
        modulusBits: algorithm.modulusLength,
        namedCurve: algorithm.namedCurve,
        publicExponent,
        algorithm: this.getKeyType(algorithm.name),
        value: this.addSpaceAfterSecondCharset(Convert.ToHex(raw)),
      },
      signature: {
        algorithm: algorithm.name,
        hash: algorithm.hash.name,
        value: this.addSpaceAfterSecondCharset(Convert.ToHex(algorithm.raw)),
      },
    };
  },

  decodeSubjectString: function decodeSubjectString(subjectString) {
    const subjectObj = {};
    const arrSubjects = subjectString.split(/, /g);

    arrSubjects.map((sbj) => {
      const arrSubject = sbj.split('=');
      const subjectName = subjectNames[arrSubject[0]] || OIDS[arrSubject[0]] || arrSubject[0];
      const subjectValue = arrSubject[1];
      subjectObj[subjectName] = subjectValue;
      if (subjectName === 'commonName') {
        subjectObj.name = subjectValue;
      }
      return true;
    });

    return subjectObj;
  },
};

export default CertHelper;
