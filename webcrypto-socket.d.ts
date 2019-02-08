import { EventEmitter } from "events";

interface ICryptoEngine {
  name: string;
  crypto: Crypto;
}

//#region Certificate storage
type HexString = string;

type CryptoCertificateFormat = string | "x509" | "request";

interface CryptoCertificate {
  type: CryptoCertificateFormat;
  publicKey: CryptoKey;
}

interface CryptoX509Certificate extends CryptoCertificate {
  notBefore: Date;
  notAfter: Date;
  serialNumber: HexString;
  issuerName: string;
  subjectName: string;
}

interface CryptoX509CertificateRequest extends CryptoCertificate {
  subjectName: string;
}

interface SocketCertificateStorage {
  keys(): Promise<string[]>;
  indexOf(item: CryptoCertificate): Promise<string | null>;

  /**
   * Import certificate from data
   *
   * @param {CertificateItemType} type Type of certificate
   * @param {(ArrayBuffer)} data Raw of certificate item
   * @returns {Promise<CryptoCertificate>}
   *
   * @memberOf CertificateStorage
   */
  importCert(type: "request", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509CertificateRequest>;
  importCert(type: "x509", data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoX509Certificate>;
  importCert(type: CryptoCertificateFormat, data: BufferSource, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;

  exportCert(format: "pem", item: CryptoCertificate): Promise<string>;
  exportCert(format: "raw", item: CryptoCertificate): Promise<ArrayBuffer>;
  exportCert(format: CryptoCertificateFormat, item: CryptoCertificate): Promise<ArrayBuffer | string>;

  setItem(item: CryptoCertificate): Promise<string>;
  getItem(key: string): Promise<CryptoCertificate>;
  getItem(key: string, algorithm: Algorithm, keyUsages: string[]): Promise<CryptoCertificate>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}
//#endregion

interface ProviderCrypto {
  id: string;
  name: string;
  readOnly: boolean;
  library?: string;
  algorithms: string[];
  isRemovable: boolean;
  atr: string;
  isHardware: boolean;
}

interface ProviderInfo {
  name: string;
  providers: ProviderCrypto[];
}

interface SocketKeyStorage {
  /**
   * Return list of names of stored keys
   *
   * @returns {Promise<string[]>}
   *
   * @memberOf KeyStorage
   */
  keys(): Promise<string[]>;

  /**
   * Returns identity of item from key storage.
   * If item is not found, then returns `null`
   */
  indexOf(item: CryptoKey): Promise<string | null>;
  /**
   * Returns key from storage
   *
   * @param {string} key
   * @returns {Promise<CryptoKey>}
   *
   * @memberOf KeyStorage
   */
  getItem(key: string): Promise<CryptoKey>;
  getItem(key: string, algorithm: Algorithm, usages: string[]): Promise<CryptoKey>;
  /**
   * Add key to storage
   *
   * @param {string} key
   * @param {CryptoKey} value
   * @returns {Promise<void>}
   *
   * @memberOf KeyStorage
   */
  setItem(value: CryptoKey): Promise<string>;

  /**
   * Removes item from storage by given key
   *
   * @param {string} key
   * @returns {Promise<void>}
   *
   * @memberOf KeyStorage
   */
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

interface SocketCrypto extends Crypto {
  id: string;
  keyStorage?: SocketKeyStorage;
  certStorage?: SocketCertificateStorage;
}

declare class SocketProvider extends EventEmitter {
  /**
   * Connection state
   * 0: connecting
   * 1: open
   * 2: closing
   * 3: closed
   */
  public state: number;
  // public cardReader: CardReader;

  public connect(address: string): this;
  public close(): void;
  public on(event: string | symbol, listener: (...args: any[]) => void): this;
  public once(event: string | symbol, listener: (...args: any[]) => void): this;
  public info(): Promise<ProviderInfo>;
  public challenge(): Promise<string>;
  public isLoggedIn(): Promise<boolean>;
  public login(): Promise<void>;
  public getCrypto(cryptoID: string): Promise<SocketCrypto>;
}

declare function setEngine(name: string, crypto: Crypto): void;

declare function getEngine(): ICryptoEngine;

export as namespace WebcryptoSocket;
