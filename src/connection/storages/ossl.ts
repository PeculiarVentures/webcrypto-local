import { Identity } from "2key-ratchet";
import { RemoteIdentity } from "2key-ratchet";
import { AsymmetricRatchet } from "2key-ratchet";
// const crypto: Crypto = require("node-webcrypto-ossl");
import * as fs from "fs";

export class OpenSSLStorage {

    public static STORAGE_NAME = ".webcrypto";
    public static IDENTITY_STORAGE = "identity";
    public static SESSION_STORAGE = "sessions";
    public static REMOTE_STORAGE = "remoteIdentity";

    public static async create() {
        if (!fs.existsSync(this.STORAGE_NAME)) {
            fs.mkdirSync(this.STORAGE_NAME);
        }
        return new this();
    }

    public identity: Identity;
    public remoteIdentities: { [key: string]: RemoteIdentity } = {};
    public sessions: { [key: string]: AsymmetricRatchet } = {};

    private constructor() {
        // some
    }

    public async loadIdentity() {
        return this.identity || null;
    }

    public async saveIdentity(value: Identity) {
        this.identity = value;
    }

    public async loadRemoteIdentity(key: string) {
        return this.remoteIdentities[key];
    }

    public async saveRemoteIdentity(key: string, value: RemoteIdentity) {
        this.remoteIdentities[key] = value;
    }

    public async loadSession(key: string) {
        const res = this.sessions[key];
        return res || null;
    }

    public async saveSession(key: string, value: AsymmetricRatchet) {
        this.sessions[key] = value;
    }

    /**
     * 
     * 
     * @param {string} key id of 
     * 
     * @memberOf OpenSSLStorage
     */
    public async findSession(key: CryptoKey) {
        for (const i in this.sessions) {
            const item = this.sessions[i];
            if (await item.hasRatchetKey(key)) {
                return item;
            }
        }
        return false;
    }

}
