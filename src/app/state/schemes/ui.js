import { Type, Schema, is } from 'quantizer';
import { CertificateList, ProviderList } from '../models';

export default new Schema('UI', {
  modal: Type.String,
  dialog: Type.String,
  snackbar: Type.String,
  dataLoaded: Type.Boolean,
  serverStatus: Type.String,
  certificates: new Type({
    name: 'CertificateList',
    instance: CertificateList,
    validate: is.list,
  }),
  providers: new Type({
    name: 'ProviderList',
    instance: ProviderList,
    validate: is.list,
  }),
});
