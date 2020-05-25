import * as ratchet from "2key-ratchet";
import idb from "idb";
import { DB } from "idb";
import { AES_CBC, ECDH, ECDSA, isEdge, isFirefox, isIE, updateEcPublicKey } from "../utils";
import { RatchetStorage } from "./base";

interface IWrapKey {
  key: CryptoKey;
  iv: ArrayBuffer;
}

interface IWrapKeyStorage {
  key: CryptoKey | ArrayBuffer;
  iv: ArrayBuffer;
}

export class BrowserStorage extends RatchetStorage {

  public static STORAGE_NAME = "webcrypto-remote";
  public static IDENTITY_STORAGE = "identity";
  public static SESSION_STORAGE = "sessions";
  public static REMOTE_STORAGE = "remoteIdentity";
  public static WRAP_KEY = "wkey";
  public static IDENTITY = "identity";

  public static async create() {
    const db = await idb.open(this.STORAGE_NAME, 2, (updater) => {
      if (updater.oldVersion === 1) {
        updater.deleteObjectStore(this.SESSION_STORAGE);
        updater.deleteObjectStore(this.IDENTITY_STORAGE);
        updater.deleteObjectStore(this.REMOTE_STORAGE);
      }
      updater.createObjectStore(this.SESSION_STORAGE);
      updater.createObjectStore(this.IDENTITY_STORAGE);
      updater.createObjectStore(this.REMOTE_STORAGE);
    });
    return new BrowserStorage(db);
  }

  protected db: DB;

  private constructor(db: DB) {
    super();
    this.db = db;
  }

  /**
   * Gets a wrapping key from the storage
   */
  public async loadWrapKey(): Promise<IWrapKey | null> {
    const wKey = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
      .objectStore<IWrapKeyStorage, string>(BrowserStorage.IDENTITY_STORAGE)
      .get(BrowserStorage.WRAP_KEY);
    if (wKey) {
      AES_CBC.iv = wKey.iv; // todo don't use global variable
      if (wKey.key instanceof ArrayBuffer) {
        const key = await ratchet.getEngine().crypto.subtle
          .importKey("raw", wKey.key, { name: AES_CBC.name, length: 256 }, true, ["encrypt", "decrypt", "wrapKey", "unwrapKey"]) as any;
        return {
          key,
          iv: wKey.iv,
        };
      }
      return {
        key: wKey.key,
        iv: wKey.iv,
      };
    }
    return null;
  }

  /**
   * Adds wrapping key to the storage
   * @param key Wrapping key
   */
  public async saveWrapKey(key: IWrapKey) {
    let item: IWrapKeyStorage;
    // Some browsers doesn't allow to keep CryptoKey in IndexedDB. We need to serialize them
    if (isEdge() || isIE()) {
      const raw = await ratchet.getEngine().crypto.subtle.exportKey("raw", key.key);
      item = {
        key: raw,
        iv: key.iv,
      };
    } else {
      item = { ...key };
    }
    await this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite")
      .objectStore<IWrapKeyStorage, string>(BrowserStorage.IDENTITY_STORAGE)
      .put(item, BrowserStorage.WRAP_KEY);
  }

  public async loadIdentity() {
    const json: ratchet.IJsonIdentity = await this.db.transaction(BrowserStorage.IDENTITY_STORAGE)
      .objectStore<ratchet.IJsonIdentity>(BrowserStorage.IDENTITY_STORAGE)
      .get(BrowserStorage.IDENTITY);
    let res: ratchet.Identity | null = null;
    if (json) {
      if (isFirefox() || isEdge() || isIE()) {
        // If IndexedDB storage doesn't support CryptoKey object
        // we need use wrapping key to protect serialized key
        const wKey = await this.loadWrapKey();
        if (!(wKey && wKey.key.usages.some((usage) => usage === "encrypt")
          && json.exchangeKey.privateKey instanceof ArrayBuffer)) {
          return null;
        }
        // Replace private data to CryptoKey
        json.exchangeKey.privateKey = await ratchet.getEngine().crypto
          .subtle.unwrapKey("jwk", json.exchangeKey.privateKey as any, wKey.key, AES_CBC, ECDH, false, ["deriveKey", "deriveBits"]);
        json.signingKey.privateKey = await ratchet.getEngine().crypto
          .subtle.unwrapKey("jwk", json.signingKey.privateKey as any, wKey.key, AES_CBC, ECDSA, false, ["sign"]);

        json.exchangeKey.publicKey = await ratchet.getEngine().crypto
          .subtle.unwrapKey("jwk", json.exchangeKey.publicKey as any, wKey.key, AES_CBC, ECDH, true, []);
        json.signingKey.publicKey = await ratchet.getEngine().crypto
          .subtle.unwrapKey("jwk", json.signingKey.publicKey as any, wKey.key, AES_CBC, ECDSA, true, ["verify"]);
      }

      res = await ratchet.Identity.fromJSON(json);
    }
    return res;
  }

  public async saveIdentity(value: ratchet.Identity) {
    let wKey: IWrapKey | undefined;
    if (isFirefox() || isEdge() || isIE()) {
      // TODO: Remove after Firefox is fixed
      // Create wrap key
      wKey = {
        key: await ratchet.getEngine().crypto.subtle.generateKey({ name: AES_CBC.name, length: 256 }, isEdge() || isIE(), ["wrapKey", "unwrapKey", "encrypt", "decrypt"]),
        iv: ratchet.getEngine().crypto.getRandomValues(new Uint8Array(AES_CBC.iv)).buffer,
      };
      await this.saveWrapKey(wKey);

      // Regenerate identity with extractable flag
      const exchangeKeyPair = await ratchet.getEngine().crypto.subtle
        .generateKey(value.exchangeKey.privateKey.algorithm as any, true, ["deriveKey", "deriveBits"]) as CryptoKeyPair;
      value.exchangeKey.privateKey = exchangeKeyPair.privateKey;
      await updateEcPublicKey(value.exchangeKey.publicKey, exchangeKeyPair.publicKey);

      const signingKeyPair = await ratchet.getEngine().crypto.subtle
        .generateKey(value.signingKey.privateKey.algorithm as any, true, ["sign", "verify"]) as CryptoKeyPair;
      value.signingKey.privateKey = signingKeyPair.privateKey;
      await updateEcPublicKey(value.signingKey.publicKey, signingKeyPair.publicKey);
    }

    const json = await value.toJSON();

    if (wKey) {
      // Replace private key data
      json.exchangeKey.privateKey = await ratchet.getEngine().crypto.subtle
        .wrapKey("jwk", value.exchangeKey.privateKey, wKey.key, AES_CBC) as any;
      json.signingKey.privateKey = await ratchet.getEngine().crypto.subtle
        .wrapKey("jwk", value.signingKey.privateKey, wKey.key, AES_CBC) as any;

      // Replace public key data, because Edge doesn't support EC
      json.exchangeKey.publicKey = await ratchet.getEngine().crypto.subtle.wrapKey("jwk", value.exchangeKey.publicKey.key, wKey.key, AES_CBC) as any;
      json.signingKey.publicKey = await ratchet.getEngine().crypto.subtle.wrapKey("jwk", value.signingKey.publicKey.key, wKey.key, AES_CBC) as any;
    }

    await this.db.transaction(BrowserStorage.IDENTITY_STORAGE, "readwrite")
      .objectStore(BrowserStorage.IDENTITY_STORAGE)
      .put(json, BrowserStorage.IDENTITY);
  }

  public async loadRemoteIdentity(key: string) {
    const json: ratchet.IJsonRemoteIdentity = await this.db.transaction(BrowserStorage.REMOTE_STORAGE)
      .objectStore(BrowserStorage.REMOTE_STORAGE)
      .get(key);
    let res: ratchet.RemoteIdentity | null = null;
    if (json) {

      const wKey = await this.loadWrapKey();
      if (wKey) {
        // Replace private key data
        json.exchangeKey = await ratchet.getEngine().crypto.subtle
          .unwrapKey("jwk", json.exchangeKey as any, wKey.key, AES_CBC, ECDH, true, []) as any;
        json.signingKey = await ratchet.getEngine().crypto.subtle
          .unwrapKey("jwk", json.signingKey as any, wKey.key, AES_CBC, ECDSA, true, ["verify"]) as any;
      }

      res = await ratchet.RemoteIdentity.fromJSON(json);
    }
    return res;
  }

  public async saveRemoteIdentity(key: string, value: ratchet.RemoteIdentity) {
    const json = await value.toJSON();

    const wKey = await this.loadWrapKey();
    if (wKey) {
      // Replace private key data
      json.exchangeKey = await ratchet.getEngine().crypto.subtle
        .wrapKey("jwk", json.exchangeKey, wKey.key, AES_CBC) as any;
      json.signingKey = await ratchet.getEngine().crypto.subtle
        .wrapKey("jwk", json.signingKey, wKey.key, AES_CBC) as any;
    }

    await this.db.transaction(BrowserStorage.REMOTE_STORAGE, "readwrite")
      .objectStore(BrowserStorage.REMOTE_STORAGE)
      .put(json, key);
  }

  public async loadSession(key: string) {
    const json = await this.db.transaction(BrowserStorage.SESSION_STORAGE)
      .objectStore<any, string>(BrowserStorage.SESSION_STORAGE)
      .get(key);
    let res: ratchet.AsymmetricRatchet | null = null;
    if (json) {
      const identity = await this.loadIdentity();
      if (!identity) {
        throw new Error("Identity is empty");
      }
      const remoteIdentity = await this.loadRemoteIdentity(key);
      if (!remoteIdentity) {
        throw new Error("Remote identity is not found");
      }
      res = await ratchet.AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);
    }
    return res;
  }

  public async saveSession(key: string, value: ratchet.AsymmetricRatchet) {
    const json = await value.toJSON();
    await this.db.transaction(BrowserStorage.SESSION_STORAGE, "readwrite")
      .objectStore(BrowserStorage.SESSION_STORAGE)
      .put(json, key);
  }

}
