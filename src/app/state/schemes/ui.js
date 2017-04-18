import { Type, Schema, is } from 'quantizer';
import { ProviderListModel } from '../models';

export default new Schema('UI', {
  modal: Type.String,
  dialog: Type.String,
  snackbar: Type.String,
  loaded: Type.Boolean,
  status: Type.String,
  providers: new Type({
    name: 'ProviderList',
    instance: ProviderListModel,
    validate: is.list,
  }),
});
