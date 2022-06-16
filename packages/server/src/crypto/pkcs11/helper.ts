import * as graphene from "graphene-pk11";
export interface OsslCryptoKey extends CryptoKey {
  __ossl: boolean;
  __index?: string;
  p11Object: {
    handle: Buffer;
    session: graphene.Session;
  };
}

export function isOsslObject(obj: unknown): obj is OsslCryptoKey {
  return !!(obj && typeof obj === "object" && "_oosl" in obj);
}

interface FixOptions {
  index?: string;
  handle?: Buffer;
}

export function fixObject(crypto: Crypto, key: { type: string; }, options?: FixOptions) {
  const osslKey = key as OsslCryptoKey;
  let handle: Buffer;
  if (options && options.handle) {
    handle = options.handle;
  } else {
    handle = Buffer.alloc(4);
    handle.writeInt32LE((crypto as any).getID(), 0);
  }
  osslKey.__ossl = true;
  osslKey.p11Object = {
    handle,
    session: (crypto as any).session,
  };

  if (options && options.index) {
    osslKey.__index = options.index;
  }
}
