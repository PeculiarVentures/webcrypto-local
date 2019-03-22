import * as ratchet from "2key-ratchet";
import { RatchetStorage } from "./base";

export class MemoryStorage extends RatchetStorage {

  private identity?: ratchet.Identity;
  private remoteIdentities: { [key: string]: ratchet.RemoteIdentity } = {};
  private sessions: { [key: string]: ratchet.AsymmetricRatchet } = {};

  public async loadIdentity(): Promise<ratchet.Identity | null> {
    return this.identity || null;
  }

  public async saveIdentity(value: ratchet.Identity): Promise<void> {
    this.identity = value;
  }

  public async loadRemoteIdentity(key: string): Promise<ratchet.RemoteIdentity | null> {
    return this.remoteIdentities[key] || null;
  }

  public async saveRemoteIdentity(key: string, value: ratchet.RemoteIdentity): Promise<void> {
    this.remoteIdentities[key] = value;
  }

  public async loadSession(key: string): Promise<ratchet.AsymmetricRatchet | null> {
    return this.sessions[key] || null;
  }

  public async saveSession(key: string, value: ratchet.AsymmetricRatchet): Promise<void> {
    this.sessions[key] = value;
  }

}
