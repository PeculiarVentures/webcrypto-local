import { State } from 'quantizer';
import { CERTIFICATE, KEY, REQUEST } from '../../constants';
import { CertificateSchema, KeySchema, RequestSchema } from '../schemes';

export default class CertificateModel extends State.Map {

  constructor(value) {
    const { type } = value;
    if (type === 'key') {
      super(Object.assign({}, KEY.DEFAULT, value), KeySchema);
    } else if (type === 'request') {
      super(Object.assign({}, REQUEST.DEFAULT, value), RequestSchema);
    } else {
      super(Object.assign({}, CERTIFICATE.DEFAULT, value), CertificateSchema);
    }
  }

}
