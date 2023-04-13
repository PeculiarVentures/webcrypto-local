import * as graphene from "graphene-pk11";
import { Crypto, CryptoParams } from "node-webcrypto-p11";

import { OpenSSLCrypto } from "../openssl";
import { Pkcs11CertificateStorage } from "./cert_storage";
import { Pkcs11SubtleCrypto } from "./subtle";

/**
 * Extends PKCS#11 WebCrypto class.
 * Some providers throws error on CreateObject function. It can be problem with different template requirements.
 * This implementation adds OpenSSL crypto to replace PKCS#11 functions for session object creation.
 */

export class Pkcs11Crypto extends Crypto {

  // NOTE: private methods from node-webcrypto-p11
  public module: graphene.Module;
  public declare slot: graphene.Slot;
  public declare token: graphene.Token;

  public ossl: OpenSSLCrypto;
  protected osslID = 0;

  constructor(props: CryptoParams) {
    super(props);
    this.module = this.slot.module;
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

}
