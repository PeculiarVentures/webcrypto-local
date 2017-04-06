import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import { OIDS } from '../constants';
// import { regExps } from '../helpers';

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

const CertHelper = {
  ab2hex: function ab2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => (`00${x.toString(16)}`).slice(-2)).join('');
  },

  hex2Array: function hex2Array(hexString) {
    const res = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      const c = hexString.slice(i, i + 2);
      res[i / 2] = parseInt(c, 16);
    }
    return res.buffer;
  },

  str2ab: function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i += 1) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  },

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
      value: this.addSpaceAfterSecondCharset(new Buffer(x509.subjectPublicKeyInfo.subjectPublicKey.valueBeforeDecode).toString('hex')),
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

    for (const item of json.extensions) {
      extensions.push({
        name: OIDS[item.extnID] || item.extnID,
        critical: item.critical || false,
        value: this.addSpaceAfterSecondCharset(item.extnValue.valueBlock.valueHex),
      });
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

    if (value.indexOf('CERTIFICATE') !== -1) {
      value = value.replace(/(-----(BEGIN|END) CERTIFICATE( REQUEST|)-----|\r|\n)/g, '');
      certBuf = this.str2ab(window.atob(value));
    } else {
      value = this.hex2Array(value.replace(/(\r|\n|\s)/g, ''));
      certBuf = value;
    }

    const asn1 = asn1js.fromBER(certBuf);
    if (asn1.offset > 0) {
      let cert = '';

      try {
        cert = new pkijs.Certificate({ schema: asn1.result });
      } catch (error) {
        console.error(error);
        try {
          cert = new pkijs.CertificationRequest({ schema: asn1.result });
        } catch (_error) {
          console.error(_error);
          return false;
        }
      }

      const json = cert.toJSON();
      const algorithm = {
        name: json.subjectPublicKeyInfo.kty,
      };
      const { modulus, publicExponent } = cert.subjectPublicKeyInfo.parsedKey;

      // Add params for Public key
      if (algorithm.name === 'RSA') {
        algorithm.modulusBits = modulus.valueBlock.valueHex.byteLength << 3;
        algorithm.publicExponent = publicExponent.valueBlock.valueHex;
      } else if (algorithm.name === 'EC') {
        algorithm.namedCurve = json.subjectPublicKeyInfo.crv;
      }

      const signature = this.prepareAlgorithm(json.signature || json.signatureAlgorithm);

      const data = {
        algorithm: {
          ...algorithm,
          ...signature,
        },
        usages: ['verify'],
      };
      return {
        raw: certBuf,
        ...data,
      };
    }
    console.error('asn1 fromBER error');
    return false;
  },
};

export default CertHelper;
