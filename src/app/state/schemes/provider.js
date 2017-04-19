import { Type, Schema, is } from 'quantizer';
import ItemListModel from '../models/item_list';

export default new Schema('Provider', {
  id: Type.ObjectID,
  name: Type.String,
  index: Type.Number,
  selected: Type.Boolean,
  readOnly: Type.Boolean,
  logged: Type.Boolean,
  loaded: Type.Boolean,
  items: new Type({
    name: 'ItemList',
    instance: ItemListModel,
    validate: is.list,
  }),
});
