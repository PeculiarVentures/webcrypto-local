import * as ratchet from "2key-ratchet";

export abstract class RatchetStorage {
  public abstract loadIdentity(): Promise<ratchet.Identity | null>;
  public abstract saveIdentity(value: ratchet.Identity): Promise<void>;
  public abstract loadRemoteIdentity(key: string): Promise<ratchet.RemoteIdentity | null>;
  public abstract saveRemoteIdentity(key: string, value: ratchet.RemoteIdentity): Promise<void>;
  public abstract loadSession(key: string): Promise<ratchet.AsymmetricRatchet | null>;
  public abstract saveSession(key: string, value: ratchet.AsymmetricRatchet): Promise<void>;
}
