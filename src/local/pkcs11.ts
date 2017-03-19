// tslint:disable-next-line:no-reference
/// <reference path="../types/pkcs11.d.ts" />

const PKCS11 = require("node-webcrypto-p11");

export const Provider: typeof PKCS11Crypto.Provider = PKCS11.Provider;
export const Crypto: typeof PKCS11Crypto.WebCrypto = PKCS11.WebCrypto;
