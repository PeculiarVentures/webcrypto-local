import { Crypto } from "@peculiar/webcrypto";
import { X509Certificate, X509ChainBuilder } from "@peculiar/x509";
import * as proto from "@webcrypto-local/proto";
import * as asn1js from "asn1js";
import * as graphene from "graphene-pk11";
import { IGetValue, CryptoX509CertificateRequest, CryptoX509Certificate, CryptoCertificate } from "node-webcrypto-p11";
import { Convert } from "pvtsutils";
import request from "request";
import { CryptoCertificateStorage, CryptoStorages } from "webcrypto-core";
const pkijs = require("pkijs");

import { Server, Session } from "../connection";
import { PvCrypto } from "../crypto";
import { ServiceCryptoItem } from "../crypto_item";
import { WebCryptoLocalError } from "../error";
import { CryptoService } from "./crypto";
import { Service } from "./service";

// register new attribute for pkcs11 modules
graphene.registerAttribute("x509Chain", 2147483905, "buffer");

export interface CryptoStoragesEx extends CryptoStorages {
  certStorage: CryptoCertificateStorage & IGetValue;
}

export class CertificateStorageService extends Service<CryptoService> {

  constructor(server: Server, crypto: CryptoService) {
    super(server, crypto, [
      //#region List of actions
      proto.CertificateStorageKeysActionProto,
      proto.CertificateStorageGetValueActionProto,
      proto.CertificateStorageIndexOfActionProto,
      proto.CertificateStorageGetItemActionProto,
      proto.CertificateStorageSetItemActionProto,
      proto.CertificateStorageRemoveItemActionProto,
      proto.CertificateStorageClearActionProto,
      proto.CertificateStorageImportActionProto,
      proto.CertificateStorageExportActionProto,
      proto.CertificateStorageGetChainActionProto,
      proto.CertificateStorageGetCRLActionProto,
      proto.CertificateStorageGetOCSPActionProto,
      //#endregion
    ]);
  }

  public async getCrypto(id: string): Promise<(globalThis.Crypto & CryptoStoragesEx) | PvCrypto> {
    return await this.object.getCrypto(id);
  }

  public getMemoryStorage() {
    return this.object.object.memoryStorage;
  }

  protected async onMessage(session: Session, action: proto.ActionProto) {
    const result = new proto.ResultProto(action);
    switch (action.action) {
      // getValue
      case proto.CertificateStorageGetValueActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.CertificateStorageGetValueActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "certStorage/getValue", {
          crypto: this.logCrypto(crypto as any),
          index: params.key
        });

        // do operation
        const item = await crypto.certStorage.getValue(params.key);

        if (item) {
          result.data = item;
        }
        break;
      }
      // getItem
      case proto.CertificateStorageGetItemActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.CertificateStorageGetItemActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "certStorage/getItem", {
          crypto: this.logCrypto(crypto as any),
          index: params.key
        });

        // do operation
        const item = await crypto.certStorage.getItem(
          params.key,
          (params.algorithm.isEmpty() ? undefined : params.algorithm.toAlgorithm())!,
          (!params.keyUsages ? undefined : params.keyUsages)!,
        );

        this.log("info", "certStorage/getItem", {
          crypto: this.logCrypto(crypto as any),
          cert: item
            ? this.logCert(item as CryptoCertificate)
            : null,
        });

        if (item) {
          // add key to memory storage
          const cryptoKey = new ServiceCryptoItem(item.publicKey, params.providerID);
          this.getMemoryStorage().add(cryptoKey);
          // add cert to memory storage
          const cryptoCert = new ServiceCryptoItem(item, params.providerID);
          this.getMemoryStorage().add(cryptoCert);

          // create Cert proto
          const certProto = await cryptoCert.toProto();
          (certProto as any).publicKey = cryptoKey.toProto();
          result.data = await certProto.exportProto();
        }
        break;
      }
      // setItem
      case proto.CertificateStorageSetItemActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.CertificateStorageSetItemActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        const cert = this.getMemoryStorage().item(params.item.id).item as CryptoX509Certificate;

        this.log("info", "certStorage/setItem", {
          crypto: this.logCrypto(crypto as any),
          cert: this.logCert(cert),
        });

        // do operation
        const index = await crypto.certStorage.setItem(cert as any);
        result.data = Convert.FromUtf8String(index);
        // result
        break;
      }
      // remove
      case proto.CertificateStorageRemoveItemActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.CertificateStorageRemoveItemActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "certStorage/removeItem", {
          crypto: this.logCrypto(crypto as any),
          index: params.key,
        });

        // do operation
        await crypto.certStorage.removeItem(params.key);
        // result
        break;
      }
      // importCert
      case proto.CertificateStorageImportActionProto.ACTION: {
        // prepare incoming data
        const params = await proto.CertificateStorageImportActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        const data = params.format === "pem" ? Convert.ToUtf8String(params.data) : params.data;

        this.log("info", "certStorage/importCert", {
          crypto: this.logCrypto(crypto as any),
          format: params.format,
          algorithm: this.logAlgorithm(params.algorithm.toAlgorithm()),
          keyUsages: params.keyUsages,
        });

        // do operation
        const item = await crypto.certStorage.importCert(params.format, data, params.algorithm.toAlgorithm(), params.keyUsages);

        // add key to memory storage
        const cryptoKey = new ServiceCryptoItem(item.publicKey, params.providerID);
        this.getMemoryStorage().add(cryptoKey);
        // add cert to memory storage
        const cryptoCert = new ServiceCryptoItem(item, params.providerID);
        this.getMemoryStorage().add(cryptoCert);
        // result
        const certProto = await cryptoCert.toProto();
        (certProto as any).publicKey = cryptoKey.toProto();
        result.data = await certProto.exportProto();
        break;
      }
      // exportCert
      case proto.CertificateStorageExportActionProto.ACTION: {
        //#region prepare incoming data
        const params = await proto.CertificateStorageExportActionProto.importProto(action);

        const crypto = await this.getCrypto(params.providerID);
        const cert = this.getMemoryStorage().item(params.item.id).item as CryptoX509Certificate;

        this.log("info", "certStorage/exportCert", {
          crypto: this.logCrypto(crypto as any),
          cert: this.logCert(cert),
        });
        //#endregion
        //#region do operation
        const exportedData = await crypto.certStorage.exportCert(params.format, cert as any);
        ////#endregion
        //#region result
        if (exportedData instanceof ArrayBuffer) {
          result.data = exportedData;
        } else {
          result.data = Convert.FromUtf8String(exportedData);
        }
        //#endregion
        break;
      }
      // keys
      case proto.CertificateStorageKeysActionProto.ACTION: {
        // load cert storage
        const params = await proto.CertificateStorageKeysActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "certStorage/keys", {
          crypto: this.logCrypto(crypto as any),
        });

        // do operation
        const keys = await crypto.certStorage.keys();
        // result
        result.data = (await proto.ArrayStringConverter.set(keys)).buffer;
        break;
      }
      // clear
      case proto.CertificateStorageClearActionProto.ACTION: {
        // load cert storage
        const params = await proto.CertificateStorageKeysActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);

        this.log("info", "certStorage/clear", {
          crypto: this.logCrypto(crypto as any),
        });

        // do operation
        await crypto.certStorage.clear();
        // result
        break;
      }
      // indexOf
      case proto.CertificateStorageIndexOfActionProto.ACTION: {
        // load cert storage
        const params = await proto.CertificateStorageIndexOfActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        const cert = this.getMemoryStorage().item(params.item.id).item as CryptoX509Certificate;

        this.log("info", "certStorage/indexOf", {
          crypto: this.logCrypto(crypto as any),
          cert: this.logCert(cert),
        });

        // do operation
        const index = await crypto.certStorage.indexOf(cert);
        // result
        if (index) {
          result.data = Convert.FromUtf8String(index);
        }
        break;
      }
      // getChain
      case proto.CertificateStorageGetChainActionProto.ACTION: {
        // load cert storage
        const params = await proto.CertificateStorageGetChainActionProto.importProto(action);
        const crypto = await this.getCrypto(params.providerID);
        const cert = this.getMemoryStorage().item(params.item.id).item as CryptoX509Certificate;

        this.log("info", "certStorage/chain", {
          crypto: this.logCrypto(crypto as any),
          cert: this.logCert(cert),
        });

        // Get chain works only for x509 item type
        if (cert.type !== "x509") {
          throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_COMMON, "Wrong item type, must be 'x509'");
        }

        // do operation
        const resultProto = new proto.CertificateStorageGetChainResultProto();
        const pkiEntryCert = await certC2P(crypto, cert);
        if (pkiEntryCert.subject.isEqual(pkiEntryCert.issuer)) { // self-signed
          // Don't build chain for self-signed certificates
          const itemProto = new proto.ChainItemProto();
          itemProto.type = "x509";
          itemProto.value = pkiEntryCert.toSchema(true).toBER(false);

          resultProto.items.push(itemProto);
        } else if ("session" in crypto) {
          let buffer: Buffer | undefined;
          try {
            buffer = (cert as any).p11Object.getAttribute("x509Chain") as Buffer;
          } catch (e) {
            // nothing
          }

          if (buffer) {
            this.log("info", "CKA_X509_CHAIN is supported");
            const ulongSize = (cert as any).p11Object.handle.length;
            let i = 0;
            while (i < buffer.length) {
              const itemType = buffer.slice(i, i + 1)[0];
              const itemProto = new proto.ChainItemProto();
              switch (itemType) {
                case 1:
                  itemProto.type = "x509";
                  break;
                case 2:
                  itemProto.type = "crl";
                  break;
                default:
                  throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_COMMON, "Unknown type of item of chain");
              }
              i++;
              const itemSizeBuffer = buffer.slice(i, i + ulongSize);
              const itemSize = itemSizeBuffer.readInt32LE(0);
              const itemValue = buffer.slice(i + ulongSize, i + ulongSize + itemSize);
              itemProto.value = new Uint8Array(itemValue).buffer;
              resultProto.items.push(itemProto);
              i += ulongSize + itemSize;
            }
          } else {
            this.log("info", "CKA_X509_CHAIN is not supported");

            const leafCertId = await crypto.certStorage.indexOf(cert);
            if (!leafCertId) {
              throw new Error(`Cannot get index for X509 Certificate`);
            }
            const leafCertRaw = await crypto.certStorage.getValue(leafCertId);
            if (!leafCertRaw) {
              throw new Error(`Cannot get X509 Certificate by id '${leafCertId}'`);
            }
            const leafCert = new X509Certificate(leafCertRaw);

            // Get all certificates from token
            const indexes = await crypto.certStorage.keys();
            const certs = [];
            for (const index of indexes) {
              // only certs
              const parts = index.split("-");
              if (parts[0] !== "x509") {
                continue;
              }

              // Parse and add cert to certs
              const certRaw = await crypto.certStorage.getValue(index);
              if (!certRaw) {
                continue;
              }
              try {
                const x509Cert = new X509Certificate(certRaw);
                certs.push(x509Cert);
              } catch {
                continue;
              }
            }
            const nodeCrypto = new Crypto();
            const chainBuilder = new X509ChainBuilder({
              certificates: certs,
            });

            const certChain = await chainBuilder.build(leafCert, nodeCrypto as globalThis.Crypto);
            // Put certs to result
            for (const item of certChain) {
              const itemProto = new proto.ChainItemProto();
              itemProto.type = "x509";
              itemProto.value = item.rawData;

              resultProto.items.push(itemProto);
            }
          }
        } else {
          throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_SUPPORTED, "Provider doesn't support GetChain method");
        }

        // log
        if (resultProto.items) {
          const items = resultProto.items
            .map((item) => item.type);
          this.log("debug", "CKA_X509_CHAIN", {
            items: items.join(","),
            size: items.length
          });
        }

        // result
        result.data = await resultProto.exportProto();

        break;
      }
      // getCRL
      case proto.CertificateStorageGetCRLActionProto.ACTION: {
        const params = await proto.CertificateStorageGetCRLActionProto.importProto(action);

        this.log("info", "certStorage/crl", {
          url: params.url,
        });

        // do operation
        const crlArray = await new Promise<ArrayBuffer>((resolve, reject) => {
          request(params.url, { encoding: null }, (err, response, body) => {
            try {
              const message = `Cannot get CRL by URI '${params.url}'`;
              if (err) {
                throw new Error(`${message}. ${err.message}`);
              }
              if (response.statusCode !== 200) {
                throw new Error(`${message}. Bad status ${response.statusCode}`);
              }

              if (Buffer.isBuffer(body)) {
                body = body.toString("binary");
              }
              body = prepareData(body);
              // convert body to ArrayBuffer
              body = new Uint8Array(body).buffer;

              // try to parse CRL for checking
              try {
                const asn1 = asn1js.fromBER(body);
                if (asn1.result.error) {
                  throw new Error(`ASN1: ${asn1.result.error}`);
                }
                const crl = new pkijs.CertificateRevocationList({
                  schema: asn1.result,
                });
                if (!crl) {
                  throw new Error(`variable crl is empty`);
                }
              } catch (e) {
                console.error(e);
                throw new Error(`Cannot parse received CRL from URI '${params.url}'`);
              }

              resolve(body);
            } catch (e) {
              reject(e);
            }
          });
        });

        // result
        result.data = crlArray;

        break;
      }
      // getOCSP
      case proto.CertificateStorageGetOCSPActionProto.ACTION: {
        const params = await pkijs.CertificateStorageGetOCSPActionProto.importProto(action);

        this.log("info", "certStorage/ocsp", {
          url: params.url,
        });

        // do operation
        const ocspArray = await new Promise<ArrayBuffer>((resolve, reject) => {
          let url = params.url;
          const options: request.CoreOptions = { encoding: null };
          if (params.options.method === "get") {
            // GET
            const b64 = Buffer.from(params.url).toString("hex");
            url += "/" + b64;
            options.method = "get";
          } else {
            // POST
            options.method = "post";
            options.headers = { "Content-Type": "application/ocsp-request" };
            options.body = Buffer.from(params.request);
          }
          request(url, options, (err, response, body) => {
            try {
              const message = `Cannot get OCSP by URI '${params.url}'`;
              if (err) {
                throw new Error(`${message}. ${err.message}`);
              }
              if (response.statusCode !== 200) {
                throw new Error(`${message}. Bad status ${response.statusCode}`);
              }

              if (Buffer.isBuffer(body)) {
                body = body.toString("binary");
              }
              body = prepareData(body);
              // convert body to ArrayBuffer
              body = new Uint8Array(body).buffer;

              // try to parse CRL for checking
              try {
                const asn1 = asn1js.fromBER(body);
                if (asn1.result.error) {
                  throw new Error(`ASN1: ${asn1.result.error}`);
                }
                const ocsp = new pkijs.OCSPResponse({
                  schema: asn1.result,
                });
                if (!ocsp) {
                  throw new Error(`variable ocsp is empty`);
                }
              } catch (e) {
                console.error(e);
                throw new Error(`Cannot parse received OCSP from URI '${params.url}'`);
              }

              resolve(body);
            } catch (e) {
              reject(e);
            }
          });
        });

        // result
        result.data = ocspArray;

        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

  protected logCert(cert: CryptoCertificate | CryptoX509Certificate | CryptoX509CertificateRequest): any {
    const res: any = {
      type: cert.type,
      token: cert.token,
      publicKey: this.logCryptoKey(cert.publicKey),
    };

    if ("subjectName" in cert) {
      res.subjectName = cert.subjectName;
    }

    return res;
  }

}

/**
 * Convert DER/PEM string to buffer
 *
 * @param data    Incoming DER/PEM string
 */
function prepareData(data: string) {
  if (data.indexOf("-----") === 0) {
    // incoming data is PEM encoded string
    data = data.replace(/-----[\w\s]+-----/gi, "").replace(/[\n\r]/g, "");
    return Buffer.from(data, "base64");
  } else {
    return Buffer.from(data, "binary");
  }
}

/**
 * Converts CryptoCertificate to PKIjs Certificate
 *
 * @param crypto      Crypto provider
 * @param cert        Crypto certificate
 */
async function certC2P(provider: CryptoStorages, cert: CryptoCertificate) {
  const certDer = await provider.certStorage.exportCert("raw", cert as any);
  const asn1 = asn1js.fromBER(certDer);
  const pkiCert = new pkijs.Certificate({ schema: asn1.result });
  return pkiCert;
}
