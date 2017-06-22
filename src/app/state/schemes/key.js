import { Type, Schema } from 'quantizer';

export default new Schema('Key', {
  id: Type.ObjectID,
  _id: Type.ObjectID,
  usages: Type.List,
  name: Type.String,
  type: Type.String,
  publicExponent: Type.Any,
  algorithm: Type.String,
  modulusLength: Type.Any,
  namedCurve: Type.Any,
  selected: Type.Boolean,
});
