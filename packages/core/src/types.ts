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
}

export interface IModule {
  name: string;
  providers: ProviderCrypto[];
}

export interface Assoc<T> {
  [key: string]: T;
}

export interface TokenInfo {
  removed: ProviderCrypto[];
  added: ProviderCrypto[];
  error?: Error;
}
