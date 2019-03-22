import * as ratchet from "2key-ratchet";
import * as fs from "fs";
import { Convert } from "pvtsutils";
import { DOUBLE_KEY_RATCHET_STORAGE_DIR } from "../../const";
import { RatchetStorage, RemoteIdentity } from "./base";

const D_KEY_IDENTITY_PRE_KEY_AMOUNT = 10;

export interface JsonRatchetEcKey {
  privateKey: string;
  publicKey: string;
  thumbprint: string;
}

export interface JsonIdentity {
  createdAt: string;
  exchangeKey: JsonRatchetEcKey;
  signingKey: JsonRatchetEcKey;
  id: number;
  preKeys: JsonRatchetEcKey[];
  signedPreKeys: JsonRatchetEcKey[];
}

export interface JsonIdentityList {
  [origin: string]: JsonIdentity;
}

export interface JsonIdentityBundle {
  version: number;
  identities: JsonIdentityList;
}

export interface IdentityList {
  [origin: string]: ratchet.Identity;
}

/**
 * Identity key storage base on @peculiar/webcrypto
 *
 * @export
 * @class OpenSSLStorage
 */
export class FileStorage extends RatchetStorage {

  public static STORAGE_NAME = DOUBLE_KEY_RATCHET_STORAGE_DIR;
  public static IDENTITY_STORAGE = "identity";
  public static SESSION_STORAGE = "sessions";
  public static REMOTE_STORAGE = "remoteIdentity";

  public identities: IdentityList = {};
  /**
   * Associative array of remote identities
   */
  public remoteIdentities: { [key: string]: RemoteIdentity } = {};
  public sessions: { [key: string]: ratchet.AsymmetricRatchet } = {};

  public async loadIdentities(): Promise<void> {
    const identityPath = FileStorage.STORAGE_NAME + "/identity.json";
    this.identities = {}; // Reset identities
    if (fs.existsSync(identityPath)) {
      const data = fs.readFileSync(identityPath).toString();
      let json: JsonIdentityBundle;
      try {
        json = JSON.parse(data);
      } catch (err) {
        return;
      }
      // Check old JSON version
      if ((json.version || 0) < 2) {
        // Old version uses 1 identity key. Need to reset JSON file.
        this.remoteIdentities = {};
        this.saveIdentities();
        this.saveRemote();
        return;
      }

      // signing key
      for (const origin in json.identities) {
        const jsonIdentity: any = json.identities[origin];

        jsonIdentity.signingKey.privateKey = await this.ecKeyToCryptoKey(jsonIdentity.signingKey.privateKey, "private", "ECDSA");
        jsonIdentity.signingKey.publicKey = await this.ecKeyToCryptoKey(jsonIdentity.signingKey.publicKey, "public", "ECDSA");
        // exchange key
        jsonIdentity.exchangeKey.privateKey = await this.ecKeyToCryptoKey(jsonIdentity.exchangeKey.privateKey, "private", "ECDH");
        jsonIdentity.exchangeKey.publicKey = await this.ecKeyToCryptoKey(jsonIdentity.exchangeKey.publicKey, "public", "ECDH");
        // onetime pre key
        for (const preKey of jsonIdentity.preKeys) {
          preKey.privateKey = await this.ecKeyToCryptoKey(preKey.privateKey, "private", "ECDH");
          preKey.publicKey = await this.ecKeyToCryptoKey(preKey.publicKey, "public", "ECDH");
        }
        // pre key
        for (const preKey of jsonIdentity.signedPreKeys) {
          preKey.privateKey = await this.ecKeyToCryptoKey(preKey.privateKey, "private", "ECDH");
          preKey.publicKey = await this.ecKeyToCryptoKey(preKey.publicKey, "public", "ECDH");
        }

        this.identities[origin] = await ratchet.Identity.fromJSON(jsonIdentity);
      }
    }
  }

  public async saveIdentities() {
    const jsonIdentities: JsonIdentityList = {};
    for (const origin in this.identities) {
      const identity = this.identities[origin];
      const json = await identity.toJSON();
      const jsonIdentity: any = json;
      // signing key
      jsonIdentity.signingKey.privateKey = await this.ecKeyToBase64(json.signingKey.privateKey);
      jsonIdentity.signingKey.publicKey = await this.ecKeyToBase64(json.signingKey.publicKey);
      // exchange key
      jsonIdentity.exchangeKey.privateKey = await this.ecKeyToBase64(json.exchangeKey.privateKey);
      jsonIdentity.exchangeKey.publicKey = await this.ecKeyToBase64(json.exchangeKey.publicKey);
      // onetime pre keys
      for (const preKey of json.preKeys) {
        (preKey as any).privateKey = await this.ecKeyToBase64(preKey.privateKey);
        (preKey as any).publicKey = await this.ecKeyToBase64(preKey.publicKey);
      }
      // pre keys
      for (const preKey of json.signedPreKeys) {
        (preKey as any).privateKey = await this.ecKeyToBase64(preKey.privateKey);
        (preKey as any).publicKey = await this.ecKeyToBase64(preKey.publicKey);
      }

      jsonIdentities[origin] = jsonIdentity;
    }

    const jsonIdentityBundle: JsonIdentityBundle = {
      version: 2,
      identities: jsonIdentities,
    };

    fs.writeFileSync(FileStorage.STORAGE_NAME + "/identity.json", JSON.stringify(jsonIdentityBundle, null, "  "), {
      encoding: "utf8",
      flag: "w+",
    });
  }

  public async getIdentity(origin: string) {
    let identity = this.identities[origin];
    if (!identity) {
      identity = await ratchet.Identity.create(0, D_KEY_IDENTITY_PRE_KEY_AMOUNT);
      this.identities[origin] = identity;
      await this.saveIdentities();
    }
    return identity;
  }

  public async loadRemoteIdentity(key: string): Promise<RemoteIdentity| null> {
    await this.loadRemote();
    return this.remoteIdentities[key] || null;
  }

  public async saveRemoteIdentity(key: string, value: ratchet.RemoteIdentity): Promise<void> {
    this.remoteIdentities[key] = value;
    await this.saveRemote();
  }

  public async removeRemoteIdentity(key: string) {
    delete this.remoteIdentities[key];
    await this.saveRemote();
  }

  public async loadSession(key: string) {
    const res = this.sessions[key];
    return res || null;
  }

  public async saveSession(key: string, value: ratchet.AsymmetricRatchet) {
    this.sessions[key] = value;
  }

  public async findSession(key: CryptoKey) {
    for (const i in this.sessions) {
      const item = this.sessions[i];
      if (await item.hasRatchetKey(key)) {
        return item;
      }
    }
    return null;
  }

  protected async  ecKeyToBase64(key: CryptoKey) {
    const oldValue = key.extractable;
    try {
      (key as any).extractable = true;

      const raw = await ratchet.getEngine().crypto.subtle.exportKey(key.type === "public" ? "spki" : "pkcs8", key);
      return Convert.ToBase64(raw);
    } finally {
      (key as any).extractable = oldValue;
    }
  }

  protected ecKeyToCryptoKey(base64: string, type: string, alg: string) {
    if (type === "public") {
      // public key
      return ratchet.getEngine().crypto.subtle.importKey("spki", Buffer.from(base64, "base64"), {
        name: alg,
        namedCurve: "P-256",
      }, true, alg === "ECDSA" ? ["verify"] : []);
    } else {
      // private key
      return ratchet.getEngine().crypto.subtle.importKey("pkcs8", Buffer.from(base64, "base64"), {
        name: alg,
        namedCurve: "P-256",
      }, true, alg === "ECDSA" ? ["sign"] : ["deriveBits", "deriveKey"]);
    }
  }

  protected async saveRemote() {
    const json: any = {};
    for (const key in this.remoteIdentities) {
      const remoteIdentity = this.remoteIdentities[key];
      const identity = await remoteIdentity.toJSON();
      json[key] = {
        signingKey: await this.ecKeyToBase64(identity.signingKey),
        exchangeKey: await this.ecKeyToBase64(identity.exchangeKey),
        id: identity.id,
        thumbprint: identity.thumbprint,
        signature: Buffer.from(identity.signature).toString("base64"),
        createdAt: identity.createdAt,
        origin: remoteIdentity.origin,
        userAgent: remoteIdentity.userAgent,
      };
    }

    fs.writeFileSync(FileStorage.STORAGE_NAME + "/remote.json", JSON.stringify(json, null, "  "), {
      encoding: "utf8",
      flag: "w+",
    });
  }

  protected async loadRemote() {
    const file = FileStorage.STORAGE_NAME + "/remote.json";
    this.remoteIdentities = {};
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file);
      const json = JSON.parse(data.toString());
      for (const key in json) {
        const identity = json[key];
        identity.signingKey = await this.ecKeyToCryptoKey(identity.signingKey, "public", "ECDSA");
        identity.exchangeKey = await this.ecKeyToCryptoKey(identity.exchangeKey, "public", "ECDH");
        identity.signature = Convert.FromBase64(identity.signature);
        identity.createdAt = new Date(identity.createdAt);
        this.remoteIdentities[key] = await ratchet.RemoteIdentity.fromJSON(identity);
        this.remoteIdentities[key].origin = identity.origin;
        this.remoteIdentities[key].userAgent = identity.userAgent;
      }
    }
  }

  protected async create(): Promise<void> {
    await this.loadIdentities();
  }

}
