import { Type, Schema } from 'quantizer';

export default new Schema('Certificate', {
  id: Type.ObjectID,
  _id: Type.ObjectID,
  name: Type.String,
  publicKeyInfo: {
    algorithm: Type.String,
    modulusBits: Type.Number,
    namedCurve: Type.Any,
  },
  selected: Type.Boolean,
  type: Type.String,
  extensions: Type.List,
  publicKey: Type.Map,
  version: Type.Number,
  signature: Type.Map,
  serialNumber: Type.String,
  issuer: Type.Map,
  subject: Type.Map,
  notBefore: Type.String,
  notAfter: Type.String,
  pem: Type.String,
});
