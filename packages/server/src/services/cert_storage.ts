import { CertificateList } from "@peculiar/asn1-x509";
import { OCSPResponse } from "@peculiar/asn1-ocsp";
import { AsnConvert } from "@peculiar/asn1-schema";
import { Crypto } from "@peculiar/webcrypto";
import { X509Certificate, X509ChainBuilder } from "@peculiar/x509";
import * as proto from "@webcrypto-local/proto";
import * as graphene from "graphene-pk11";
import * as wcp11 from "node-webcrypto-p11";
import { Convert } from "pvtsutils";
import { CryptoCertificateStorage, CryptoStorages } from "webcrypto-core";

import { Server, Session } from "../connection";
import { ServiceCryptoItem } from "../crypto_item";
import { WebCryptoLocalError } from "../error";
import { CryptoService } from "./crypto";
import { Service } from "./service";

// register new attribute for pkcs11 modules
graphene.registerAttribute("x509Chain", 2147483905, "buffer");

export interface CryptoStoragesEx extends CryptoStorages {
  certStorage: CryptoCertificateStorage & wcp11.IGetValue;
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

  public async getCrypto(id: string): Promise<wcp11.Crypto> {
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
            ? this.logCert(item as wcp11.CryptoCertificate)
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
        const cert = this.getMemoryStorage().item(params.item.id).item as wcp11.CryptoCertificate;

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
        const alg = params.algorithm.toAlgorithm();
        const item = await crypto.certStorage.importCert(params.format, data, alg, params.keyUsages);

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
        const cert = this.getMemoryStorage().item(params.item.id).item as wcp11.CryptoCertificate;

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
        const cert = this.getMemoryStorage().item(params.item.id).item as wcp11.CryptoCertificate;

        this.log("info", "certStorage/indexOf", {
          crypto: this.logCrypto(crypto),
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
        const cert = this.getMemoryStorage().item(params.item.id).item as wcp11.CryptoCertificate;

        this.log("info", "certStorage/chain", {
          crypto: this.logCrypto(crypto as any),
          cert: this.logCert(cert),
        });

        // Get chain works only for x509 item type
        if (cert.type !== "x509") {
          throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_COMMON, "Wrong item type, must be 'x509'");
        }
        const x509Cert = cert as wcp11.X509Certificate;

        // do operation
        const resultProto = new proto.CertificateStorageGetChainResultProto();

        if (x509Cert.subjectName === x509Cert.issuerName) { // Self-signed certificate
          // Don't build chain for self-signed certificates
          const certDer = await crypto.certStorage.exportCert("raw", cert);
          const itemProto = new proto.ChainItemProto();
          itemProto.type = "x509";
          itemProto.value = certDer;

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
        const response = await fetch(params.url);
        const message = `Cannot get CRL by URI '${params.url}'`;

        if (!response.ok) {
          throw new Error(`${message}. Bad status ${response.status}`);
        }

        const body = await response.arrayBuffer();

        // try to parse CRL for checking
        try {
          AsnConvert.parse(body, CertificateList);
        } catch (e) {
          this.log("error", "certStorage/crl", {
            url: params.url,
            error: `${e}`,
          });
          throw new Error(`Cannot parse received CRL from URI '${params.url}'`);
        }

        const crlArray = body;

        // result
        result.data = crlArray;

        break;
      }
      // getOCSP
      case proto.CertificateStorageGetOCSPActionProto.ACTION: {
        const params = await proto.CertificateStorageGetOCSPActionProto.importProto(action);

        this.log("info", "certStorage/ocsp", {
          url: params.url,
          method: params.options.method,
        });

        // do operation
        let url = params.url;
        const options: RequestInit = {};
        let body: ArrayBuffer;

        if (params.options.method === "get") {
          // GET
          const b64 = Buffer.from(params.request).toString("base64url");
          url += "/" + b64;
          options.method = "GET";
        } else {
          // POST
          options.method = "POST";
          options.headers = { "Content-Type": "application/ocsp-request" };
          options.body = Buffer.from(params.request);
        }

        const response = await fetch(url, options);
        const message = `Cannot get OCSP by URI '${params.url}'`;

        if (!response.ok) {
          throw new Error(`${message}. Bad status ${response.status}`);
        }

        body = await response.arrayBuffer();

        // try to parse OCSP for checking
        try {
          AsnConvert.parse(body, OCSPResponse);
        } catch (e) {
          console.error(e);
          throw new Error(`Cannot parse received OCSP from URI '${params.url}'`);
        }

        // result
        result.data = body;

        break;
      }
      default:
        throw new WebCryptoLocalError(WebCryptoLocalError.CODE.ACTION_NOT_IMPLEMENTED, `Action '${action.action}' is not implemented`);
    }
    return result;
  }

  protected logCert(cert: wcp11.CryptoCertificate | wcp11.X509Certificate | wcp11.X509CertificateRequest): any {
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
