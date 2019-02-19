import { Crypto, CryptoParams } from "node-webcrypto-p11";
import { PvKeyStorage } from "./key_storage";

export class PvCrypto extends Crypto {
    public keyStorage: PvKeyStorage;

    constructor(props: CryptoParams) {
        super(props);

        this.keyStorage = new PvKeyStorage(this);
    }
}
