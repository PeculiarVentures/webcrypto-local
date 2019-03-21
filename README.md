# webcrypto-local

[![CircleCI](https://circleci.com/gh/PeculiarVentures/webcrypto-local.svg?style=svg)](https://circleci.com/gh/PeculiarVentures/webcrypto-local)

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

#### Example

Open `dist/index.html`

### Related
- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)