# webcrypto-local

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/2key-ratchet/master/LICENSE.md)


`webcrypto-local` is a cross platform service that provides access to PKCS#11 implementations over a `ProtoBuf` based protocol, the client end of this protocol is implemented in a WebCrypto polyfill we call `webcrypto-socket`. This protocol provides for message confidentiality and integrity via `2key-ratchet` and implements a security policy mechanism that allows the user to approve which peers can interact with it. 


## Build

```
tsc
```

## Run

```
node out/test/local
```

# webcrypto-socket

## Build

```
rollup -c
```

## Run

### Tests combined with Chrome native webcrypto

Open `test/index.html`

### Example

Open `dist/index.html`

## Related
- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)
