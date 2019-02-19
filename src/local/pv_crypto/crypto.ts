import * as graphene from "graphene-pk11";
import { Crypto, CryptoParams } from "node-webcrypto-p11";
import { PvKeyStorage } from "./key_storage";

export class PvCrypto extends Crypto {
    public keyStorage: PvKeyStorage;
    public module: graphene.Module;
    public slot: graphene.Slot;
    public token: graphene.Token;
    public session: graphene.Session;

    constructor(props: CryptoParams) {
        super(props);
        this.module = this.slot.module;
        this.keyStorage = new PvKeyStorage(this);
    }
}
