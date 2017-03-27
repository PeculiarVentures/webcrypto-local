import { State } from 'quantizer';
import { CERTIFICATE, KEY } from '../../constants';
import { CertificateSchema, KeySchema } from '../schemes';

export default class CertificateModel extends State.Map {

  constructor(value) {
    if (value.type === 'key') {
      super(Object.assign({}, KEY.DEFAULT, value), KeySchema);
    } else {
      super(Object.assign({}, CERTIFICATE.DEFAULT, value), CertificateSchema);
    }
  }

}
