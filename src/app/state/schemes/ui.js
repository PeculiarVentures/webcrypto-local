import { Type, Schema, is } from 'quantizer';
import { CertificateList } from '../models';

export default new Schema('UI', {
  modal: Type.String,
  dialog: Type.String,
  snackbar: Type.String,
  serverIsOnline: Type.Boolean,
  certificates: new Type({
    name: 'CertificateList',
    instance: CertificateList,
    validate: is.list,
  }),
});
