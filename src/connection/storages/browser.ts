/// <reference types="idb" />
import { Identity, IJsonIdentity } from "2key-ratchet";
import { IJsonRemoteIdentity, RemoteIdentity } from "2key-ratchet";
import { AsymmetricRatchet, getEngine, IJsonAsymmetricRatchet } from "2key-ratchet";
import { DB } from "idb";
import { AES_CBC, ECDH, ECDSA, isEdge, isFirefox, updateEcPublicKey } from "../helper";

interface IWrapKey {
    key: CryptoKey;
    iv: ArrayBuffer;
}

export class BrowserStorage {

    public static STORAGE_NAME = "webcrypto-remote";
    public static IDENTITY_STORAGE = "identity";
    public static SESSION_STORAGE = "sessions";
    public static REMOTE_STORAGE = "remoteIdentity";

    public static async create() {
        // await idb.delete(this.STORAGE_NAME);
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

    public async loadWrapKey(): Promise<IWrapKey | null> {
        const wkey = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
            .objectStore(BrowserStorage.IDENTITY_STORAGE).get("wkey") as IWrapKey;
        if (wkey) {
            if (isEdge()) {
                if (!(wkey.key instanceof ArrayBuffer)) return null;
                wkey.key = await getEngine().crypto.subtle.importKey("raw", wkey.key as any, { name: AES_CBC.name, length: 256 }, false, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]) as any;
            }
            AES_CBC.iv = wkey.iv;
        }
        return wkey || null;
    }
    public async saveWrapKey(key: IWrapKey) {
        if (isEdge()) {
            key = {
                key: await getEngine().crypto.subtle.exportKey("raw", key.key) as any,
                iv: key.iv,
            };

        }
        const tx = this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite");
        tx.objectStore(BrowserStorage.IDENTITY_STORAGE).put(key, "wkey");
        return tx.complete;
    }

    public async loadIdentity() {
        const json: IJsonIdentity = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
            .objectStore(BrowserStorage.IDENTITY_STORAGE).get("identity");
        let res: Identity | null = null;
        if (json) {
            if (isFirefox() || isEdge()) {
                const wkey = await this.loadWrapKey();
                if (!(wkey && wkey.key.usages.some((usage) => usage === "encrypt")
                    && json.exchangeKey.privateKey instanceof ArrayBuffer)) {
                    return null;
                }
                // Replace private data to CryptoKey
                json.exchangeKey.privateKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.privateKey as any, wkey.key, AES_CBC, ECDH, false, ["deriveKey", "deriveBits"]);
                json.signingKey.privateKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.privateKey as any, wkey.key, AES_CBC, ECDSA, false, ["sign"]);

                if (isEdge()) {
                    json.exchangeKey.publicKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.exchangeKey.publicKey as any, wkey.key, AES_CBC, ECDH, true, []);
                    json.signingKey.publicKey = await getEngine().crypto.subtle.unwrapKey("jwk", json.signingKey.publicKey as any, wkey.key, AES_CBC, ECDSA, true, ["verify"]);
                }
            }

            res = await Identity.fromJSON(json);
        }
        return res;
    }

    public async saveIdentity(value: Identity) {
        let wkey: IWrapKey;
        if (isFirefox() || isEdge()) {
            // TODO: Remove after Firefox is fixed
            // Create wrap key
            wkey = {
                key: await getEngine().crypto.subtle.generateKey({ name: AES_CBC.name, length: 256 }, isEdge(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]),
                iv: getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer,
            };
            await this.saveWrapKey(wkey);

            // Regenerate identity with extractable flag
            const exchangeKeyPair = await getEngine().crypto.subtle
                .generateKey(value.exchangeKey.privateKey.algorithm as any, true, ["deriveKey", "deriveBits"]) as CryptoKeyPair;
            value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
            await updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);

            const signingKeyPair = await getEngine().crypto.subtle
                .generateKey(value.signingKey.privateKey.algorithm as any, true, ["sign", "verify"]) as CryptoKeyPair;
            value.signingKey.privateKey = signingKeyPair.privateKey;
            await updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);
        }

        const json = await value.toJSON();

        if (isFirefox() || isEdge()) {
            // Replace private key data
            json.exchangeKey.privateKey = await getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.privateKey, wkey.key, AES_CBC) as any;
            json.signingKey.privateKey = await getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.privateKey, wkey.key, AES_CBC) as any;

            if (isEdge()) {
                // Replace public key data, because Edge doesn't support EC
                json.exchangeKey.publicKey = await getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wkey.key, AES_CBC) as any;
                json.signingKey.publicKey = await getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wkey.key, AES_CBC) as any;
            }
        }

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
