import * as Proto from "@webcrypto-local/proto";
import { Convert } from "pvtsutils";
import {
  BufferSourceConverter, CryptoCertificate, CryptoCertificateFormat,
  CryptoCertificateStorage, ImportAlgorithms, PemConverter, CryptoX509Certificate, CryptoX509CertificateRequest,
} from "webcrypto-core";
import { SocketCrypto } from "./crypto";
import * as utils from "./utils";

const IMPORT_CERT_FORMATS = ["raw", "pem", "x509", "request"];

export class CertificateStorage implements CryptoCertificateStorage {

  protected readonly provider: SocketCrypto;

  constructor(provider: SocketCrypto) {
    this.provider = provider;
  }

  public indexOf(item: CryptoCertificate): Promise<string | null>;
  public async indexOf(item: Proto.CryptoCertificateProto): Promise<string | null> {
    // check
    utils.checkCryptoCertificate(item, "item");

    // prepare request
    const proto = new Proto.CertificateStorageIndexOfActionProto();
    proto.providerID = this.provider.id;
    proto.item = item;

    // send and receive result
    const result = await this.provider.client.send(proto);
    return result ? Convert.ToUtf8String(result) : null;
  }

  public async hasItem(item: CryptoCertificate): Promise<boolean> {
    const index = await this.indexOf(item);
    return !!index;
  }

  public exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
  public exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
  public exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;
  public async exportCert(format: CryptoCertificateFormat, item: Proto.CryptoCertificateProto): Promise<ArrayBuffer | string> {
    // check
    utils.checkPrimitive(format, "string", "format");
    utils.checkCryptoCertificate(item, "item");

    // prepare request
    const proto = new Proto.CertificateStorageExportActionProto();
    proto.providerID = this.provider.id;

    proto.format = "raw"; // export only 'raw' format
    proto.item = item;

    // send and receive result
    const result = await this.provider.client.send(proto);

    // prepare result
    if (format === "raw") {
      // raw
      return result;
    } else {
      // pem
      let header = "";
      switch (item.type) {
        case "x509": {
          header = "CERTIFICATE";
          break;
        }
        case "request": {
          header = "CERTIFICATE REQUEST";
          break;
        }
        default:
          throw new Error(`Cannot create PEM for unknown type of certificate item`);
      }
      const pem = PemConverter.fromBufferSource(result, header);
      return pem;
    }
  }

  public async importCert(format: "x509", data: BufferSource, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoX509Certificate>;
  public async importCert(format: "request", data: BufferSource, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoX509CertificateRequest>;
  public async importCert(format: "raw" | "x509" | "request", data: BufferSource, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public async importCert(format: "pem", data: string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public async importCert(format: CryptoCertificateFormat | "x509" | "request", data: BufferSource | string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public async importCert(format: CryptoCertificateFormat | "x509" | "request", data: BufferSource | string, algorithm: ImportAlgorithms, keyUsages: KeyUsage[]): Promise<CryptoCertificate> {
    // check
    utils.checkPrimitive(format, "string", "format");
    if (!~IMPORT_CERT_FORMATS.indexOf(format)) {
      throw new TypeError(`format: Is invalid value. Must be ${IMPORT_CERT_FORMATS.join(", ")}`);
    }
    if (format === "pem") {
      utils.checkPrimitive(data, "string", "data");
    } else {
      utils.checkBufferSource(data, "data");
    }
    utils.checkAlgorithm(algorithm, "algorithm");
    utils.checkArray(keyUsages, "keyUsages");

    // prepare
    const algProto = utils.prepareAlgorithm(algorithm!);
    let rawData: ArrayBuffer;
    if (BufferSourceConverter.isBufferSource(data)) {
      rawData = BufferSourceConverter.toArrayBuffer(data);
    } else if (typeof data === "string") {
      rawData = PemConverter.toArrayBuffer(data);
    } else {
      throw new TypeError("data: Is not type String, ArrayBuffer or ArrayBufferView");
    }

    // prepare request
    const proto = new Proto.CertificateStorageImportActionProto();
    proto.providerID = this.provider.id;
    proto.format = "raw";
    proto.data = rawData;
    proto.algorithm = algProto;
    proto.keyUsages = keyUsages;

    // send and receive result
    const result = await this.provider.client.send(proto);

    // prepare result
    const certItem = await Proto.CryptoCertificateProto.importProto(result);

    // certItem type for request and x509 format
    if ((format === "request" || format === "x509")
      && certItem.type !== format) {
      throw new TypeError(`Imported item is not ${format}`);
    }

    return this.prepareCertItem(certItem) as any;
  }

  public async keys() {
    // prepare request
    const proto = new Proto.CertificateStorageKeysActionProto();
    proto.providerID = this.provider.id;

    // send and receive data
    const result = await this.provider.client.send(proto);

    // prepare result
    if (result) {
      const keys = Convert.ToUtf8String(result).split(",");
      return keys;
    }
    return [];
  }

  public getItem(key: string): Promise<CryptoCertificate>;
  public getItem(key: string, algorithm: Algorithm, keyUsages: KeyUsage[]): Promise<CryptoCertificate>;
  public async getItem(key: string, algorithm?: Algorithm, keyUsages?: KeyUsage[]) {
    // check
    utils.checkPrimitive(key, "string", "key");
    if (algorithm) {
      utils.checkAlgorithm(algorithm, "algorithm");
      utils.checkArray(keyUsages, "keyUsages");
    }

    // prepare request
    const proto = new Proto.CertificateStorageGetItemActionProto();
    proto.providerID = this.provider.id;
    proto.key = key;

    if (algorithm) {
      proto.algorithm = utils.prepareAlgorithm(algorithm);
      proto.keyUsages = keyUsages!;
    }

    // send and receive result
    const result = await this.provider.client.send(proto);

    // prepare result
    if (result && result.byteLength) {
      const certItem = await Proto.CryptoCertificateProto.importProto(result);
      return this.prepareCertItem(certItem);
    }
    throw new Error("Cannot get CryptoCertificate from storage by index");
  }

  public async setItem(value: CryptoCertificate): Promise<string>;
  public async setItem(value: Proto.CryptoCertificateProto) {
    // check
    utils.checkCryptoCertificate(value, "value");

    // prepare request
    const proto = new Proto.CertificateStorageSetItemActionProto();
    proto.providerID = this.provider.id;
    proto.item = value;

    // send and receive result
    const data = await this.provider.client.send(proto);
    return Convert.ToUtf8String(data);
  }

  public async removeItem(key: string) {
    // check
    utils.checkPrimitive(key, "string", "key");

    // prepare request
    const proto = new Proto.CertificateStorageRemoveItemActionProto();
    proto.providerID = this.provider.id;
    proto.key = key;

    // send and receive result
    await this.provider.client.send(proto);
  }

  public async clear() {
    // prepare request
    const proto = new Proto.CertificateStorageClearActionProto();
    proto.providerID = this.provider.id;

    // send and receive result
    await this.provider.client.send(proto);
  }

  public async getChain(value: CryptoCertificate): Promise<Proto.ChainItemProto[]>;
  public async getChain(value: Proto.CryptoCertificateProto) {
    // check
    utils.checkCryptoCertificate(value, "value");

    // prepare request
    const proto = new Proto.CertificateStorageGetChainActionProto();
    proto.providerID = this.provider.id;
    proto.item = value;

    // send and receive result
    const data = await this.provider.client.send(proto);
    const resultProto = await Proto.CertificateStorageGetChainResultProto.importProto(data);
    return resultProto.items;
  }

  public async getCRL(url: string) {
    // check
    utils.checkPrimitive(url, "string", "url");

    // prepare request
    const proto = new Proto.CertificateStorageGetCRLActionProto();
    proto.providerID = this.provider.id;
    proto.url = url;

    // send and receive result
    const data = await this.provider.client.send(proto);
    return data;
  }

  public async getOCSP(url: string, request: BufferSource, options?: Proto.OCSPRequestOptions) {
    // check
    utils.checkPrimitive(url, "string", "url");
    utils.checkBufferSource(request, "request");

    // prepare request
    const proto = new Proto.CertificateStorageGetOCSPActionProto();
    proto.providerID = this.provider.id;
    proto.url = url;
    proto.request = BufferSourceConverter.toArrayBuffer(request);

    if (options) {
      // copy options to proto
      for (const key in options) {
        (proto as any).options[key] = (options as any)[key];
      }
    }

    // send and receive result
    const data = await this.provider.client.send(proto);
    return data;
  }

  protected async prepareCertItem(item: Proto.CryptoCertificateProto) {
    const raw = await item.exportProto();
    let result: Proto.CryptoCertificateProto;
    switch (item.type) {
      case "x509": {
        result = await Proto.CryptoX509CertificateProto.importProto(raw);
        break;
      }
      case "request": {
        result = await Proto.CryptoX509CertificateRequestProto.importProto(raw);
        break;
      }
      default:
        throw new Error(`Unsupported CertificateItem type '${item.type}'`);
    }
    (result as any).provider = this.provider;
    return result;
  }

}
