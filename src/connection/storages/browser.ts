/// <reference types="idb" />
import { Identity, IJsonIdentity } from "2key-ratchet";
import { IJsonRemoteIdentity, RemoteIdentity } from "2key-ratchet";
import { AsymmetricRatchet, IJsonAsymmetricRatchet } from "2key-ratchet";
import { DB } from "idb";

export class BrowserStorage {

    public static STORAGE_NAME = "webcrypto-remote";
    public static IDENTITY_STORAGE = "identity";
    public static SESSION_STORAGE = "sessions";
    public static REMOTE_STORAGE = "remoteIdentity";

    public static async create() {
        const db = await idb.open(this.STORAGE_NAME, 1, (updater) => {
            updater.createObjectStore(this.SESSION_STORAGE);
            updater.createObjectStore(this.IDENTITY_STORAGE);
            updater.createObjectStore(this.REMOTE_STORAGE);
        });
        return new BrowserStorage(db);
    }

    protected db: DB;

    private constructor(db: DB) {
        this.db = db;
    }

    public async loadIdentity() {
        const json: IJsonIdentity = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
            .objectStore(BrowserStorage.IDENTITY_STORAGE).get("identity");
        let res: Identity | null = null;
        if (json) {
            res = await Identity.fromJSON(json);
        }
        return res;
    }

    public async saveIdentity(value: Identity) {
        const json = await value.toJSON();
        const tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(json, "identity");
        return tx.complete;
    }

    public async loadRemoteIdentity(key: string) {
        const json: IJsonRemoteIdentity = await this.db.transaction(BrowserStorage.REMOTE_STORAGE)
            .objectStore(BrowserStorage.REMOTE_STORAGE).get(key);
        let res: RemoteIdentity | null = null;
        if (json) {
            res = await RemoteIdentity.fromJSON(json);
        }
        return res;
    }

    public async saveRemoteIdentity(key: string, value: RemoteIdentity) {
        const json = await value.toJSON();
        const tx = this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.REMOTE_STORAGE).put(json, key);
        return tx.complete;
    }

    public async loadSession(key: string) {
        const json: IJsonAsymmetricRatchet = await this.db.transaction(BrowserStorage.SESSION_STORAGE)
            .objectStore(BrowserStorage.SESSION_STORAGE).get(key);
        let res: AsymmetricRatchet | null = null;
        if (json) {
            const identity = await this.loadIdentity();
            if (!identity) {
                throw new Error("Identity is empty");
            }
            const remoteIdentity = await this.loadRemoteIdentity(key);
            if (!remoteIdentity) {
                throw new Error("Remote identity is not found");
            }
            res = await AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);
        }
        return res;
    }

    public async saveSession(key: string, value: AsymmetricRatchet) {
        const json = await value.toJSON();
        const tx = this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.SESSION_STORAGE).put(json, key);
        return tx.complete;
    }

}
