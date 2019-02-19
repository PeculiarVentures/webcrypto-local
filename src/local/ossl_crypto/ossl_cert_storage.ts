import { Crypto } from "@peculiar/webcrypto";
import * as fs from "fs";
import { Convert } from "pvtsutils";
import * as core from "webcrypto-core";
import { WebCryptoLocalError } from "../error";
import { Certificate } from "./pki/cert";
import { X509CertificateRequest } from "./pki/request";
import { X509Certificate } from "./pki/x509";

const crypto = new Crypto();

interface IJsonOpenSSLCertificateStorage {
  [key: string]: IJsonOpenSSLCertificate;
}

interface IJsonOpenSSLCertificate {
  algorithm: Algorithm;
  usages: KeyUsage[];
  type: core.CryptoCertificateType;
  raw: string;
  createdAt: string;
  lastUsed: string;
}

export class OpenSSLCertificateStorage implements core.CryptoCertificateStorage {

  public file: string;

  constructor(file: string) {
    this.file = file;
  }

  public exportCert(format: "pem", item: core.CryptoCertificate): Promise<string>;
  public exportCert(format: "raw", item: core.CryptoCertificate): Promise<ArrayBuffer>;
  public exportCert(format: core.CryptoCertificateFormat, item: core.CryptoCertificate): Promise<ArrayBuffer | string>;
  public async exportCert(format: core.CryptoCertificateFormat, item: Certificate): Promise<ArrayBuffer | string> {
    switch (format) {
      case "raw": {
        return item.exportRaw();
      }
      case "pem": {
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.UNKNOWN, "PEM format is not implemented");
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, "Unsupported format for CryptoCertificate. Must be 'raw' or 'pem'");
    }
  }

  public importCert(format: "raw", data: BufferSource, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public importCert(format: "pem", data: string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public importCert(format: core.CryptoCertificateFormat, data: BufferSource | string, algorithm: core.ImportAlgorithms, keyUsages: KeyUsage[]): Promise<core.CryptoCertificate>;
  public async importCert(format: core.CryptoCertificateFormat, data: BufferSource | string, algorithm?: Algorithm, keyUsages?: KeyUsage[]) {
    let rawData: ArrayBuffer;
    let rawType: core.CryptoCertificateType | null = null;

    //#region Check
    switch (format) {
      case "pem":
        if (typeof data !== "string") {
          throw new TypeError("data: Is not type string");
        }
        if (core.PemConverter.isCertificate(data)) {
          rawType = "x509";
        } else if (core.PemConverter.isCertificateRequest(data)) {
          rawType = "request";
        } else {
          throw new core.OperationError("data: Is not correct PEM data. Must be Certificate or Certificate Request");
        }
        rawData = core.PemConverter.toArrayBuffer(data);
        break;
      case "raw":
        if (!core.BufferSourceConverter.isBufferSource(data)) {
          throw new TypeError("data: Is not type ArrayBuffer or ArrayBufferView");
        }
        rawData = core.BufferSourceConverter.toArrayBuffer(data);
        break;
      default:
        throw new TypeError("format: Is invalid value. Must be 'raw', 'pem'");
    }
    //#endregion
    switch (rawType) {
      case "x509": {
        const x509 = await X509Certificate.importCert(crypto, rawData, algorithm, keyUsages);
        return x509;
      }
      case "request": {
        const request = await X509CertificateRequest.importCert(crypto, rawData, algorithm, keyUsages);
        return request;
      }
      default: {
        try {
          const x509 = await X509Certificate.importCert(crypto, rawData, algorithm, keyUsages);
          return x509;
        } catch (e) {
          // nothing
        }

        try {
          const request = await X509CertificateRequest.importCert(crypto, rawData, algorithm, keyUsages);
          return request;
        } catch (e) {
          // nothing
        }

        throw new core.OperationError("Cannot parse Certificate or Certificate Request from incoming ASN1");
      }
    }
  }

  public async keys() {
    const items = this.readFile();
    return Object.keys(items);
  }

  public async hasItem(item: core.CryptoCertificate) {
    return !!this.indexOf(item);
  }

  public setItem(item: Certificate): Promise<string>;
  public async setItem(item: Certificate) {
    const certs = this.readFile();
    const value = await this.certToJson(item);
    certs[item.id] = value;
    this.writeFile(certs);
    return item.id;
  }

  public async indexOf(item: core.CryptoCertificate): Promise<string> {
    if (item instanceof Certificate) {
      const certs = this.readFile();
      for (const index in certs) {
        const identity = await item.getID(crypto, "SHA-256");
        if (index === identity) {
          return index;
        }
      }
      return null;
    } else {
      throw new WebCryptoLocalError(WebCryptoLocalError.CODE.CASE_ERROR, `Parameter is not OpenSSL CertificateItem`);
    }
  }

  public async getItem(key: string) {
    const certs = this.readFile();
    const value = certs[key];
    if (!value) {
      return null;
    }

    // Update date of last usage
    value.lastUsed = new Date().toISOString();
    this.writeFile(certs);

    return this.certFromJson(value);
  }

  public async removeItem(key: string) {
    const certs = this.readFile();
    delete certs[key];
    this.writeFile(certs);
  }

  public async clear() {
    this.writeFile({});
  }

  protected async certToJson(cert: Certificate) {
    const date = new Date().toISOString();
    return {
      algorithm: (cert.publicKey.algorithm as any).toAlgorithm ? (cert.publicKey.algorithm as any).toAlgorithm() : cert.publicKey.algorithm,
      usages: cert.publicKey.usages,
      type: cert.type,
      createdAt: date,
      lastUsed: date,
      raw: Convert.ToBase64(cert.exportRaw()),
    } as IJsonOpenSSLCertificate;
  }

  protected async certFromJson(json: IJsonOpenSSLCertificate) {
    return this.importCert("raw", Convert.FromBase64(json.raw), json.algorithm, json.usages);
  }

  protected readFile(): IJsonOpenSSLCertificateStorage {
    if (!fs.existsSync(this.file)) {
      return {};
    }
    const buf = fs.readFileSync(this.file);
    return JSON.parse(buf.toString());
  }

  protected writeFile(json: IJsonOpenSSLCertificateStorage) {
    const buf = new Buffer(JSON.stringify(json));
    fs.writeFileSync(this.file, buf, {
      encoding: "utf8",
      flag: "w+",
    });
  }

}
