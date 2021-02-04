export interface CryptoServicePolicy {
  requirePasswordOnAllKeys: boolean;
  maxNumberOfKeys: number;
  maxKeyAge: number;
}

export interface CryptoServiceAlgorithm {
  // algorithm name
  name: string;
}

export interface CryptoServiceRsaAlgorithm extends CryptoServiceAlgorithm {
  // 1024, 2048, 4096
  modulusLengths: number[];
  // [3], [1,0,1]
  publicExponents: ArrayBufferView;
}

export interface CryptoServiceSecretAlgorithm extends CryptoServiceAlgorithm {
  // 128, 256, 512
  lengths: number[];
}

export interface CryptoServiceEcAlgorithm extends CryptoServiceAlgorithm {
  // P-256, P-384, P-521
  namedCurves: string[];
}

export interface CryptoServiceEcdhAlgorithm extends CryptoServiceEcAlgorithm {
  // AES, HMAC, PBKDF2
  derivedKeyTypes: CryptoServiceSecretAlgorithm[];
}

export interface CryptoService {
  name: string;
  policy: CryptoServicePolicy;
  supportedAlgorithms: CryptoServiceAlgorithm[];
}

export interface ServerInfo {
  id: string;
  type: string;
  version: string;
  cryptoServices: CryptoService[];
  preKey: string;
}

export interface Version {
  major: number;
  minor: number;
}

export interface TokenInfo {
  /**
   * application-defined label, assigned during token initialization.
   */
  label: string;

  /**
   * ID of the device manufacturer.
   */
  manufacturerID: string;

  /**
   * model of the device.
   */
  model: string;

  /**
   * character-string serial number of the device
   */
  serialNumber: string;

  /**
   * bit flags indicating capabilities and status of the device
   */
  flags: number;

  /**
   * maximum number of sessions that can be opened with the token at one time by a single application
   */
  maxSessionCount: number;

  /**
   * number of sessions that this application currently has open with the token
   */
  sessionCount: number;
  /**
   * maximum number of read/write sessions that can be opened
   * with the token at one time by a single application
   */
  maxRwSessionCount: number;
  /**
   * number of read/write sessions that this application currently has open with the token
   */
  rwSessionCount: number;
  /**
   * maximum length in bytes of the PIN
   */
  maxPinLen: number;
  /**
   * minimum length in bytes of the PIN
   */
  minPinLen: number;
  /**
   * the total amount of memory on the token in bytes in which objects may be stored
   */
  totalPublicMemory: number;
  /**
   * the amount of free (unused) memory on the token in bytes for objects
   */
  freePublicMemory: number;
  /**
   * the total amount of memory on the token in bytes in which private objects may be stored
   */
  totalPrivateMemory: number;
  /**
   * the amount of free (unused) memory on the token in bytes for private objects
   */
  freePrivateMemory: number;
  /**
   * version number of hardware
   */

  hardwareVersion: Version;

  firmwareVersion: Version;
}

export interface ProviderCrypto {
  name: string;
  card: string;
  id: string;
  readOnly: boolean;
  library?: string;
  atr?: string;
  algorithms: string[];
  isHardware: boolean;
  isRemovable: boolean;
  token?: TokenInfo;
}

export interface IModule {
  name: string;
  providers: ProviderCrypto[];
}

export interface Assoc<T> {
  [key: string]: T;
}

export interface TokenInfoEvent {
  removed: ProviderCrypto[];
  added: ProviderCrypto[];
  error?: Error;
}
