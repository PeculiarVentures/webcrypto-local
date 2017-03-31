/* eslint no-undef: 0 */
import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';
import { SERVER_URL } from '../../../scripts/config';
import { decodeSubjectString } from '../helpers';

export const ws = new WebcryptoSocket.SocketProvider();

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

  keyDataHandler: function keyDataHandler(keyData) {
    return {
      id: keyData.id,
      algorithm: keyData.algorithm.name,
      usages: keyData.usages,
      name: 'Need key "name"',
      size: keyData.algorithm.modulusLength,
      createdAt: 'Need key "createdAt"',
      lastUsed: 'Need key "lastUsed"',
      type: 'key',
    };
  },

  certDataHandler: function certDataHandler(certData) {
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
  },
};
