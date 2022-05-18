# webcrypto-local

[![Coverage Status](https://coveralls.io/repos/github/PeculiarVentures/webcrypto-local/badge.svg?branch=master)](https://coveralls.io/github/PeculiarVentures/webcrypto-local?branch=update-deps)
[![Test](https://github.com/PeculiarVentures/webcrypto-local/actions/workflows/test.yml/badge.svg)](https://github.com/PeculiarVentures/webcrypto-local/actions/workflows/test.yml)

`webcrypto-local` is a cross platform service that provides access to PKCS#11 implementations over a `ProtoBuf` based protocol we call `webcrypto-socket`. It provides for message confidentiality and integrity via `2key-ratchet` and implements a security policy mechanism that allows the user to approve which peers can interact with it.

## webcrypto-socket

#### Build

```
npm run build
```

#### Tests

```
npm test
```

### Related
- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)