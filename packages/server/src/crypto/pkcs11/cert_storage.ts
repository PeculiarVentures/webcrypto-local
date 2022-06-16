/**
 * NOTE: We are using PKCS#11 Certificate storage directly from built folder,
 * because it's not exported from node-webcrypto-p11 module
 */

import { X509Certificate } from "graphene-pk11";
import * as wcp11 from "node-webcrypto-p11";
import * as core from "webcrypto-core";

import { Pkcs11Crypto } from "./crypto";
import { fixObject, isOsslObject } from "./helper";

export class Pkcs11CertificateStorage extends wcp11.CertificateStorage {

  protected crypto!: Pkcs11Crypto;

  constructor(crypto: Pkcs11Crypto) {
    super(crypto);
  }

  public override async getItem(index: string): Promise<wcp11.Pkcs11CryptoCertificate>;
  public override async getItem(index: string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<wcp11.Pkcs11CryptoCertificate>;
  public override async getItem(index: any, algorithm?: any, keyUsages?: any): Promise<wcp11.Pkcs11CryptoCertificate> {
    let cert: core.CryptoCertificate | undefined;

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
      // @ts-ignore
      cert.__index = index;
    }

    return cert as wcp11.Pkcs11CryptoCertificate;
  }

  public override async importCert(format: core.CryptoCertificateFormat, data: string | BufferSource, algorithm: wcp11.Pkcs11ImportAlgorithms, keyUsages: KeyUsage[]): Promise<wcp11.Pkcs11CryptoCertificate>;
  public override async importCert(format: "raw", data: BufferSource, algorithm: wcp11.Pkcs11ImportAlgorithms, keyUsages: KeyUsage[]): Promise<wcp11.Pkcs11CryptoCertificate>;
  public override async importCert(format: "pem", data: string, algorithm: wcp11.Pkcs11ImportAlgorithms, keyUsages: KeyUsage[]): Promise<wcp11.Pkcs11CryptoCertificate>;
  public override async importCert(format: any, data: any, algorithm: any, keyUsages: any): Promise<wcp11.Pkcs11CryptoCertificate> {
    let cert: core.CryptoCertificate;

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

    return cert as wcp11.Pkcs11CryptoCertificate;
  }

  public exportCert(format: "raw", item: core.CryptoCertificate): Promise<ArrayBuffer>;
  public exportCert(format: "pem", item: core.CryptoCertificate): Promise<string>;
  public exportCert(format: core.CryptoCertificateFormat, item: core.CryptoCertificate): Promise<ArrayBuffer | string>;
  public async exportCert(format: core.CryptoCertificateFormat, item: core.CryptoCertificate): Promise<ArrayBuffer | string> {
    if (item instanceof wcp11.CryptoCertificate) {
      return super.exportCert(format, item);
    } else {
      return this.crypto.ossl.certStorage.exportCert(format, item);
    }
  }

  public async indexOf(item: core.CryptoCertificate): Promise<string | null> {
    if (item instanceof wcp11.CryptoCertificate) {
      return super.indexOf(item);
    } else {
      return (item as any).__index || null;
    }
  }

}
