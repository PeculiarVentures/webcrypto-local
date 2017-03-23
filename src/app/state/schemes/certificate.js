import { Type, Schema } from 'quantizer';
import { KeyModel } from '../models';

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
  keyInfo: KeyModel,
  selected: Type.Boolean,
  type: Type.String,
});
