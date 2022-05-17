import { getEngine } from "2key-ratchet";
import * as graphene from "graphene-pk11";
import * as wcp11 from "node-webcrypto-p11";
import * as core from "webcrypto-core";
import { OPENSSL_CERT_STORAGE_DIR, OPENSSL_KEY_STORAGE_DIR } from "../../const";
import { OpenSSLCertificateStorage } from "./cert_storage";
import { OpenSSLKeyStorage } from "./key_storage";
import { OpenSSLSubtleCrypto } from "./subtle";

export class OpenSSLCrypto extends core.Crypto implements wcp11.Crypto {

  public isReadWrite = true;
  public isLoginRequired = false;

  public readonly info: wcp11.ProviderInfo = {
    id: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
    slot: 0,
    name: "OpenSSL",
    reader: "OpenSSL",
    serialNumber: "61e5e90712ba8abfb6bde6b4504b54bf88d36d0c",
    isRemovable: false,
    isHardware: false,
    algorithms: [
      "SHA-1",
      "SHA-256",
      "SHA-384",
      "SHA-512",
      "RSASSA-PKCS1-v1_5",
      "RSA-PSS",
      "HMAC",
      "AES-CBC",
      "AES-GCM",
      "PBKDF2",
      "ECDH",
      "ECDSA",
    ],
  };

  public crypto = getEngine().crypto;
  public subtle: OpenSSLSubtleCrypto;
  public keyStorage: OpenSSLKeyStorage;
  public certStorage: OpenSSLCertificateStorage;

  public isLoggedIn = true;

  constructor() {
    super();

    this.keyStorage = new OpenSSLKeyStorage(`${OPENSSL_KEY_STORAGE_DIR}/store.json`, this);
    this.certStorage = new OpenSSLCertificateStorage(`${OPENSSL_CERT_STORAGE_DIR}/store.json`, this);
    this.subtle = new OpenSSLSubtleCrypto(this);
  }
  public templateBuilder: wcp11.ITemplateBuilder = null as any;
  public session: graphene.Session = null as any;

  public getRandomValues<T extends ArrayBufferView | null>(array: T): T {
    return this.crypto.getRandomValues(array);
  }

  public open(rw?: boolean | undefined): void {
    throw new Error("Method not implemented.");
  }
  public reset(): void {
    throw new Error("Method not implemented.");
  }
  public login(pin?: string | undefined): void {
    throw new Error("Method not implemented.");
  }
  public logout(): void {
    throw new Error("Method not implemented.");
  }
  public close(): void {
    throw new Error("Method not implemented.");
  }

}
