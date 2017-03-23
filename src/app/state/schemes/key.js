import { Type, Schema } from 'quantizer';

export default new Schema('Key', {
  createdAt: Type.String,
  lastUsed: Type.String,
  algorithm: Type.String,
  size: Type.Number,
  usages: Type.List,
});
