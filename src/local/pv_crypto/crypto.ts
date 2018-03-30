import { WebCrypto, P11WebCryptoParams } from "node-webcrypto-p11";
import { PvKeyStorage } from './key_storage';

export class PvCrypto extends WebCrypto {
    public keyStorage: PvKeyStorage;

    constructor(props: P11WebCryptoParams) {
        super(props);

        this.keyStorage = new PvKeyStorage(this);
    }
}