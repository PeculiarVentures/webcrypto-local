import { State } from 'quantizer';
import { CERTIFICATE } from '../../constants';
import { CertificateSchema } from '../schemes';

export default class CertificateModel extends State.Map {

  constructor(value) {
    super(Object.assign({}, CERTIFICATE.DEFAULT, value), CertificateSchema);
  }

}
