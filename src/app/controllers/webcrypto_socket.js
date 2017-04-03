/* eslint no-undef: 0 */
// import UUID from 'uuid';
import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';
import { SERVER_URL } from '../../../scripts/config';

export const ws = new WebcryptoSocket.SocketProvider();
window.ws = ws;

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
  O: 'organization',
  CN: 'commonName',
  C: 'country',
  OU: 'organizationUnit',
  L: 'city',
  ST: 'region',
  '1.3.6.1.2.1.1.5': 'hostName',
};

export const WSController = {
  connect: function connect(onListening, onError, onClose) {
    ws.connect(SERVER_URL)
      .on('error', onError)
      .on('listening', onListening)
      .on('close', onClose);
  },

  decoratePkcs10Subject: function decoratePkcs10Subject(pkcs10, data) {
    Object.keys(data).map((key) => {
      if ({}.hasOwnProperty.call(subjectTypesAndValues, key)) {
        pkcs10.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
          type: subjectTypesAndValues[key],
          value: new asn1js.Utf8String({ value: data[key] }),
        }));
      }
      return true;
    });
    return pkcs10;
  },

  keyDataHandler: function keyDataHandler(keyData, keyId) {
    return {
      id: keyData.id,
      _id: keyId,
      algorithm: keyData.algorithm.name,
      usages: keyData.usages,
      name: '',
      size: keyData.algorithm.modulusLength,
      createdAt: '',
      lastUsed: '',
      type: 'key',
    };
  },

  certDataHandler: function certDataHandler(certData, certId) {
    const { publicKey, id, type, subjectName } = certData;
    const decodedSubject = this.decodeSubjectString(subjectName);
    return Object.assign({
      id,
      _id: certId,
      name: '',
      type: type === 'request' ? 'request' : 'certificate',
      keyInfo: {
        algorithm: publicKey.algorithm.name,
        usages: publicKey.usages,
        modulusBits: publicKey.algorithm.modulusLength,
        namedCurve: publicKey.algorithm.namedCurve,
        type: this.getKeyType(publicKey.algorithm.name),
      },
      commonName: '',
      organization: '',
      organizationUnit: '',
      country: '',
      region: '',
      city: '',
    }, decodedSubject);
  },

  decodeSubjectString: function decodeSubjectString(subjectString) {
    const subjectObj = {};
    const arrSubjects = subjectString.split(/, /g);
    arrSubjects.map((sbj) => {
      const arrSubject = sbj.split('=');
      const subjectName = subjectNames[arrSubject[0]];
      const subjectValue = arrSubject[1];
      subjectObj[subjectName] = subjectValue;
      if (subjectName === 'commonName') {
        subjectObj.name = subjectValue;
      }
      return true;
    });
    return subjectObj;
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
};
