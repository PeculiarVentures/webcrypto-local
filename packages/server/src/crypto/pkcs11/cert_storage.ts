/**
 * NOTE: We are using PKCS#11 Certificate storage directly from built folder,
 * because it's not exported from node-webcrypto-p11 module
 */

import { X509Certificate } from "graphene-pk11";
import { CertificateStorage, CryptoCertificate, Pkcs11ImportAlgorithms } from "node-webcrypto-p11";
import { CryptoCertificateFormat, ImportAlgorithms } from "webcrypto-core";
import * as core from "webcrypto-core";

import { Pkcs11Crypto } from "./crypto";
import { fixObject, isOsslObject } from "./helper";

export class Pkcs11CertificateStorage extends CertificateStorage {

  protected crypto!: Pkcs11Crypto;

  constructor(crypto: Pkcs11Crypto) {
    super(crypto);
  }

  public getItem(index: string): Promise<CryptoCertificate>;
  public getItem(index: string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public async getItem(index: string, algorithm?: ImportAlgorithms, keyUsages?: KeyUsage[]) {
    let cert: CryptoCertificate;

    try {
      cert = await super.getItem(index, algorithm!, keyUsages!);
    } catch (err) {
      try {
        const object: X509Certificate = (this as any).getItemById(index).toType();
        cert = await this.crypto.ossl.certStorage.importCert("raw", object.value, algorithm!, keyUsages!);
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

  public importCert(format: core.CryptoCertificateFormat, data: BufferSource | string, algorithm: Pkcs11ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public importCert(format: "raw", data: BufferSource, algorithm: Pkcs11ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public importCert(format: "pem", data: string, algorithm: Pkcs11ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public async importCert(format: any, data: any, algorithm: any, keyUsages: any) {
    let cert: CryptoCertificate;

    try {
      cert = await super.importCert(format, data, algorithm!, keyUsages!);
    } catch (err) {
      try {
        cert = await this.crypto.ossl.certStorage.importCert(format, data, algorithm, keyUsages!);
        fixObject(this.crypto, cert);
        fixObject(this.crypto, cert.publicKey);
      } catch (e) {
        throw err;
      }
    }

    return cert;
  }

  public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
  public exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
  public exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;
  public async exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string> {
    if (!isOsslObject(item)) {
      return super.exportCert(format, item);
    } else {
      return this.crypto.ossl.certStorage.exportCert(format, item);
    }
  }

  public async indexOf(item: CryptoCertificate): Promise<string | null> {
    if (isOsslObject(item)) {
      return item.__index || null;
    } else {
      return super.indexOf(item);
    }
  }

}
