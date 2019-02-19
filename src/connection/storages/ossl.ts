import { Identity } from "2key-ratchet";
import { RemoteIdentity } from "2key-ratchet";
import { AsymmetricRatchet, getEngine } from "2key-ratchet";
import * as fs from "fs";
import { Convert } from "pvtsutils";
import { DOUBLE_KEY_RATCHET_STORAGE_DIR } from "../../core/const";

const D_KEY_IDENTITY_PRE_KEY_AMOUNT = 10;

export interface RemoteIdentityEx extends RemoteIdentity {
  userAgent?: string;
  origin?: string;
}

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
  [origin: string]: Identity;
}

/**
 * Identity key storage base on @peculiar/webcrypto
 *
 * @export
 * @class OpenSSLStorage
 */
export class OpenSSLStorage {

  public static STORAGE_NAME = DOUBLE_KEY_RATCHET_STORAGE_DIR;
  public static IDENTITY_STORAGE = "identity";
  public static SESSION_STORAGE = "sessions";
  public static REMOTE_STORAGE = "remoteIdentity";

  /**
   * Creates new instance of storage
   *
   * @static
   * @returns
   * @memberof OpenSSLStorage
   */
  public static async create() {
    const res = new this();
    await res.loadIdentities();
    return res;
  }

  public identities: IdentityList = {};
  /**
   * Associative array of remote identities
   *
   * @type {{ [key: string]: RemoteIdentityEx }}
   * @memberof OpenSSLStorage
   */
  public remoteIdentities: { [key: string]: RemoteIdentityEx } = {};
  public sessions: { [key: string]: AsymmetricRatchet } = {};

  private constructor() {
    // some
  }

  public async loadIdentities(): Promise<void> {
    const identityPath = OpenSSLStorage.STORAGE_NAME + "/identity.json";
    this.identities = {}; // Reset identities
    if (fs.existsSync(identityPath)) {
      const data = fs.readFileSync(identityPath).toString();
      let json: JsonIdentityBundle | undefined;
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

        this.identities[origin] = await Identity.fromJSON(jsonIdentity);
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

    fs.writeFileSync(OpenSSLStorage.STORAGE_NAME + "/identity.json", JSON.stringify(jsonIdentityBundle, null, "  "), {
      encoding: "utf8",
      flag: "w+",
    });
  }

  /**
   * Returns identity by domain origin
   * @param origin Domain origin
   */
  public async getIdentity(origin: string) {
    let identity = this.identities[origin];
    if (!identity) {
      identity = await Identity.create(0, D_KEY_IDENTITY_PRE_KEY_AMOUNT);
      this.identities[origin] = identity;
      await this.saveIdentities();
    }
    return identity;
  }

  /**
   * Returns remote identity by key
   *
   * @param {string}  key     identifier of identity
   * @returns {Promise<RemoteIdentityEx>}
   * @memberof OpenSSLStorage
   */
  public async loadRemoteIdentity(key: string): Promise<RemoteIdentityEx> {
    await this.loadRemote();
    return this.remoteIdentities[key];
  }

  /**
   * Adds remote identity to storage
   *
   * @param {string}          key     identifier of identity
   * @param {RemoteIdentity}  value   remote identity
   * @returns {Promise<void>}
   * @memberof OpenSSLStorage
   */
  public async saveRemoteIdentity(key: string, value: RemoteIdentity): Promise<void> {
    this.remoteIdentities[key] = value;
    await this.saveRemote();
  }

  /**
   * Remove remote identity from storage by key
   *
   * @param {string}          key     identifier of identity
   * @memberof OpenSSLStorage
   * @returns {Promise<void>}
   */
  public async removeRemoteIdentity(key: string) {
    delete this.remoteIdentities[key];
    await this.saveRemote();
  }

  public async isTrusted(remoteIdentity: RemoteIdentity) {
    const ok = await remoteIdentity.verify();
    if (!ok) {
      return false;
    }
    const trustedIdentity = await this.loadRemoteIdentity(remoteIdentity.signingKey.id);
    if (!trustedIdentity) {
      return false;
    }
    return true;
  }

  public async loadSession(key: string) {
    const res = this.sessions[key];
    return res || null;
  }

  public async saveSession(key: string, value: AsymmetricRatchet) {
    this.sessions[key] = value;
  }

  public async findSession(key: CryptoKey) {
    for (const i in this.sessions) {
      const item = this.sessions[i];
      if (await item.hasRatchetKey(key)) {
        return item;
      }
    }
    return false;
  }

  protected ecKeyToBase64(key: CryptoKey) {
    return new Promise((resolve, reject) => {
      const k: any = key;
      if (key.type === "public") {
        // public key
        k.native_.exportSpki((err: Error, data: Buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.toString("base64"));
          }
        });
      } else {
        // private key
        k.native_.exportPkcs8((err: Error, data: Buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.toString("base64"));
          }
        });
      }
    });
  }

  protected ecKeyToCryptoKey(base64: string, type: string, alg: string) {
    if (type === "public") {
      // public key
      return getEngine().crypto.subtle.importKey("spki", Buffer.from(base64, "base64"), {
        name: alg,
        namedCurve: "P-256",
      }, true, alg === "ECDSA" ? ["verify"] : []);
    } else {
      // private key
      return getEngine().crypto.subtle.importKey("pkcs8", Buffer.from(base64, "base64"), {
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

    fs.writeFileSync(OpenSSLStorage.STORAGE_NAME + "/remote.json", JSON.stringify(json, null, "  "), {
      encoding: "utf8",
      flag: "w+",
    });
  }

  protected async loadRemote() {
    const file = OpenSSLStorage.STORAGE_NAME + "/remote.json";
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
        this.remoteIdentities[key] = await RemoteIdentity.fromJSON(identity);
        this.remoteIdentities[key].origin = identity.origin;
        this.remoteIdentities[key].userAgent = identity.userAgent;
      }
    }
  }

}
