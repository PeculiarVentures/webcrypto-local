import * as graphene from "graphene-pk11";
import { P11WebCryptoParams, WebCrypto } from "node-webcrypto-p11";

import { OpenSSLCrypto } from "../ossl_crypto/index";
import { Pkcs11CertificateStorage } from "./cert_storage";
import { Pkcs11SubtleCrypto } from "./subtle";

/**
 * Extends PKCS#11 WebCrypto class.
 * Some providers throws error on CreateObject function. It can be problem with different template requirements.
 * This implementation adds OpenSSL crypto to replace PKCS#11 functions for session object creation.
 */

export class Pkcs11Crypto extends WebCrypto {

    // NOTE: private methods from node-webcrypto-p11
    public module: graphene.Module;
    public slot: graphene.Slot;
    public token: graphene.Token;
    public session: graphene.Session;

    public ossl: OpenSSLCrypto;
    protected osslID = 0;

    constructor(props: P11WebCryptoParams) {
        super(props);

        this.ossl = new OpenSSLCrypto();

        this.subtle = new Pkcs11SubtleCrypto(this);
        this.certStorage = new Pkcs11CertificateStorage(this) as any; // TODO: Fix type error
    }

    /**
     * Returns increased ID for OpenSSL objects
     */
    public getID() {
        return ++this.osslID;
    }

    public getRandomValues<T extends Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | null>(array: T): T {
        return super.getRandomValues(array) as any;
    }
}
