import { Type, Schema } from 'quantizer';

export default new Schema('Certificate', {
  id: Type.ObjectID,
  _id: Type.ObjectID,
  name: Type.String,
  selected: Type.Boolean,
  type: Type.string,
  pem: Type.String,
  general: {
    serialNumber: Type.String,
    version: Type.Number,
    notBefore: Type.String,
    notAfter: Type.String,
    thumbprint: Type.String,
  },
  subject: Type.Map,
  issuer: Type.Map,
  publicKey: {
    modulusBits: Type.Any,
    namedCurve: Type.Any,
    publicExponent: Type.Any,
    algorithm: Type.String,
    value: Type.String,
  },
  signature: {
    algorithm: Type.String,
    hash: Type.Any,
    value: Type.String,
  },
  extensions: Type.List,
});
