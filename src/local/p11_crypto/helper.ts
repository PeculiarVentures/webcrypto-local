export interface OsslCryptoKey extends CryptoKey {
    __ossl: boolean;
    __index?: string;
    p11Object: {
        handle: Buffer;
        session: GraphenePkcs11.Session;
    };
}

export function isOsslObject(obj: any): obj is OsslCryptoKey {
    return !!(obj && obj.__ossl);
}

interface FixOptions {
    index?: string;
    handle?: Buffer;
}

export function fixObject(crypto: Crypto, key: { type: string }, options?: FixOptions) {
    const osslKey = key as OsslCryptoKey;
    let handle: Buffer;
    if (options && options.handle)  {
        handle = options.handle;
    } else {
        handle = new Buffer(4);
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
