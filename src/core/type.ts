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

export class Event<T> {

    public readonly target: T;
    public readonly event: string;

    constructor(target: T, event: string) {
        this.target = target;
        this.event = event;
    }
}
