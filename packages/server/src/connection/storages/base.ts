import * as ratchet from "2key-ratchet";

export interface RemoteIdentity extends ratchet.RemoteIdentity {
  userAgent?: string;
  origin?: string;
}

export abstract class RatchetStorage {
  public static async create<T extends RatchetStorage>(this: new () => T): Promise<RatchetStorage> {
    const res = new this();
    await res.create();
    return res;
  }

  public abstract loadIdentities(): Promise<void>;
  public abstract saveIdentities(): Promise<void>;
  /**
   * Returns identity by domain origin.
   * If identity doesn't exist creates new
   * @param origin Domain origin
   */
  public abstract getIdentity(origin: string): Promise<ratchet.Identity>;

  public async createIdentity(preKeyAmount: number = 10) {
    const identity = await ratchet.Identity.create(0, preKeyAmount);
    return identity;
  }

  /**
   * Returns remote identity by key
   *
   * @param key     identifier of identity
   */
  public abstract loadRemoteIdentity(key: string): Promise<RemoteIdentity | null>;
  /**
   * Adds remote identity to storage
   *
   * @param key     identifier of identity
   * @param value   remote identity
   */
  public abstract saveRemoteIdentity(key: string, value: ratchet.RemoteIdentity): Promise<void>;
  /**
   * Remove remote identity from storage by key
   *
   * @param key     identifier of identity
   */
  public abstract removeRemoteIdentity(key: string): Promise<void>;

  public async isTrusted(remoteIdentity: ratchet.RemoteIdentity): Promise<boolean> {
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

  public abstract loadSession(key: string): Promise<ratchet.AsymmetricRatchet>;
  public abstract saveSession(key: string, value: ratchet.AsymmetricRatchet): Promise<void>;
  public abstract findSession(key: CryptoKey): Promise<null | ratchet.AsymmetricRatchet>;

  protected abstract create(): Promise<void>;
}
