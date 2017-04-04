import { OIDS } from '../constants';

const asn1js = require('asn1js');
const { Certificate } = require('pkijs');

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

/**
 * Converts X500Name to string
 * @param  {RDN} name X500Name
 * @param  {string} splitter Splitter char. Default ','
 * @returns string Formated string
 * Example:
 * > C=Some name, O=Some organization name, C=RU
 */
function name2str(name, splitter) {
  splitter = splitter || ',';
  const res = [];
  name.typesAndValues.forEach((typeValue) => {
    const type = typeValue.type;
    const oidValue = OID[type.toString()];
    const oidName = oidValue && oidValue.short ? oidValue.short : type.toString();
    res.push(`${oidName}=${typeValue.value.valueBlock.value}`);
  });
  return res.join(`${splitter} `);
}

function prepareAlgorithm(pkiAlg) {
  switch (pkiAlg.algorithmId) {
    case '1.2.840.113549.1.1.5': {
      return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' };
    }
    case ' 1.2.840.113549.1.1.11': {
      return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' };
    }
    case ' 1.2.840.113549.1.1.12': {
      return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-384' };
    }
    case ' 1.2.840.113549.1.1.13': {
      return { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-512' };
    }
    default: {
      return { name: pkiAlg.algorithmId };
    }
  }
}

function addSpaceAfterSecondCharset(string) {
  return string.replace(/(.{2})/g, '$1 ').trim().toUpperCase();
}

/**
 *
 *
 * @param {ArrayBuffer} raw
 * @returns
 */
export default function certToJson(raw) {
  const asn1 = asn1js.fromBER(raw);
  const x509 = new Certificate({ schema: asn1.result });
  const json = x509.toJSON();

  // Public Key
  const publicKey = {
    algorithm: {
      name: json.subjectPublicKeyInfo.kty,
    },
    value: addSpaceAfterSecondCharset(new Buffer(x509.subjectPublicKeyInfo.subjectPublicKey.valueBeforeDecode).toString('hex')),
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
      value: addSpaceAfterSecondCharset(item.extnValue.valueBlock.valueHex),
    });
  }

  return {
    version: x509.version,
    serialNumber: addSpaceAfterSecondCharset(json.serialNumber.valueBlock.valueHex),
    notBefore: x509.notBefore.value,
    notAfter: x509.notAfter.value,
    issuerName: name2str(x509.issuer),
    subjectName: name2str(x509.subject),
    publicKey,
    extensions,
    signature: {
      algorithm: prepareAlgorithm(json.signature),
      value: addSpaceAfterSecondCharset(json.signatureValue.valueBlock.valueHex),
    },
  };
}
