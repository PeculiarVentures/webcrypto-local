interface CryptoEx extends Crypto {
    session?: GraphenePkcs11.Session;

    keyStorage: IKeyStorage;
    certStorage: ICertificateStorage;
}
