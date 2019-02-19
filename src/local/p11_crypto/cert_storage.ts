/**
 * NOTE: We are using PKCS#11 Certificate storage directly from built folder,
 * because it's not exported from node-webcrypto-p11 module
 */

import { X509Certificate } from "graphene-pk11";
import { CertificateStorage } from "node-webcrypto-p11";
import * as core from "webcrypto-core";

import { Pkcs11Crypto } from "./crypto";
import { fixObject, isOsslObject } from "./helper";

export class Pkcs11CertificateStorage extends CertificateStorage {

  protected crypto: Pkcs11Crypto;

  constructor(crypto: Pkcs11Crypto) {
    super(crypto);
  }

  public getItem(index: string): Promise<core.CryptoCertificate>;
  public getItem(index: string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public async getItem(index: string, algorithm?: core.ImportAlgorithms, keyUsages?: KeyUsage[]) {
    let cert: core.CryptoCertificate;

    try {
      cert = await super.getItem(index, algorithm, keyUsages);
    } catch (err) {
      try {
        const object: X509Certificate = (this as any).getItemById(index).toType();
        cert = await this.crypto.ossl.certStorage.importCert("raw", object.value, algorithm, keyUsages);
        fixObject(this.crypto, cert, {
          index,
          handle: object.handle,
        });
        fixObject(this.crypto, cert.publicKey);
      } catch (err2) {
        throw err;
      }
    }

    if (isOsslObject(cert)) {
      cert.__index = index;
    }

    return cert;
  }

  public importCert(format: "raw", data: BufferSource, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public importCert(format: "pem", data: string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public importCert(format: core.CryptoCertificateFormat, data: BufferSource | string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public async importCert(format: core.CryptoCertificateFormat, data: BufferSource | string, algorithm?: Algorithm, keyUsages?: KeyUsage[]) {
    let cert: core.CryptoCertificate;

    try {
      cert = await super.importCert(format, data, algorithm, keyUsages);
    } catch (err) {
      try {
        cert = await this.crypto.ossl.certStorage.importCert(format, data, algorithm, keyUsages);
        fixObject(this.crypto, cert);
        fixObject(this.crypto, cert.publicKey);
      } catch (e) {
        throw err;
      }
    }

    return cert;
  }

  public exportCert(format: "raw", item: core.CryptoCertificate): Promise<ArrayBuffer>;
  public exportCert(format: "pem", item: core.CryptoCertificate): Promise<string>;
  public exportCert(format: core.CryptoCertificateFormat, item: core.CryptoCertificate): Promise<ArrayBuffer | string>;
  public async exportCert(format: core.CryptoCertificateFormat, item: core.CryptoCertificate): Promise<ArrayBuffer | string> {
    if (!isOsslObject(item)) {
      return super.exportCert(format, item);
    } else {
      return this.crypto.ossl.certStorage.exportCert(format, item);
    }
  }

  public async indexOf(item: core.CryptoCertificate): Promise<string | null> {
    if (isOsslObject(item)) {
      return item.__index;
    } else {
      return super.indexOf(item);
    }
  }

}
