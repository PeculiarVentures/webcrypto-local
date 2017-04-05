import { Type, Schema } from 'quantizer';

export default new Schema('Provider', {
  id: Type.ObjectID,
  name: Type.String,
  index: Type.Number,
  selected: Type.Boolean,
});
