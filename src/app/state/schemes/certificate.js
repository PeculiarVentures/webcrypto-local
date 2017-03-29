import { Type, Schema } from 'quantizer';

export default new Schema('Certificate', {
  id: Type.ObjectID,
  name: Type.String,
  startDate: Type.String,
  expirationDate: Type.String,
  hostName: Type.String,
  organization: Type.String,
  organizationUnit: Type.String,
  country: Type.String,
  region: Type.String,
  city: Type.String,
  keyInfo: {
    createdAt: Type.String,
    lastUsed: Type.String,
    algorithm: Type.String,
    size: Type.number,
    usages: Type.List,
  },
  selected: Type.Boolean,
  type: Type.String,
});
