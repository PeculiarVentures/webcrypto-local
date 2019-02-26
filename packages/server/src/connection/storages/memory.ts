import * as ratchet from "2key-ratchet";
import { RatchetStorage, RemoteIdentity } from "./base";

export class MemoryStorage extends RatchetStorage {

  private identities: { [origin: string]: ratchet.Identity } = {};
  private remoteIdentities: { [key: string]: RemoteIdentity } = {};
  private sessions: { [key: string]: ratchet.AsymmetricRatchet } = {};

  public async loadIdentities(): Promise<void> {
    // nothing
  }
  public async saveIdentities(): Promise<void> {
    // nothing
  }

  public async getIdentity(origin: string): Promise<ratchet.Identity> {
    let identity = this.identities[origin];
    if (!identity) {
      identity = await this.createIdentity(5);
      this.identities[origin] = identity;
    }
    return identity;
  }

  public async loadRemoteIdentity(key: string): Promise<RemoteIdentity | null> {
    return this.remoteIdentities[key] || null;
  }

  public async saveRemoteIdentity(key: string, value: ratchet.RemoteIdentity): Promise<void> {
    this.remoteIdentities[key] = value;
  }

  public async removeRemoteIdentity(key: string): Promise<void> {
    delete this.remoteIdentities[key];
  }

  public async loadSession(key: string): Promise<ratchet.AsymmetricRatchet> {
    const session = this.sessions[key];
    if (!session) {
      throw new Error("Cannot get AsymmetricRatchet from storage by index");
    }
    return session;
  }

  public async saveSession(key: string, value: ratchet.AsymmetricRatchet): Promise<void> {
    this.sessions[key] = value;
  }

  public async findSession(key: CryptoKey): Promise<null | ratchet.AsymmetricRatchet> {
    for (const i in this.sessions) {
      const item = this.sessions[i];
      if (await item.hasRatchetKey(key)) {
        return item;
      }
    }
    return null;
  }

  protected async create(): Promise<void> {
    // nothing
  }

}
