# webcrypto-local

`webcrypto-local` is a cross platform service that provides access to PKCS#11 implementations over a `ProtoBuf` based protocol we call `webcrypto-socket`. It provides for message confidentiality and integrity via `2key-ratchet` and implements a security policy mechanism that allows the user to approve which peers can interact with it.

## UI

### Quick Development Start

 * Clone latest version this repository
 * `npm install`
 * `npm run development`
 
### Quick Production Start

 * Clone latest version this repository
 * `npm install`
 * `npm run production`

### Clear

* `npm run clear`

### Automatic deploy to GitHub pages

* `npm run deploy`

## TS

### Build

```
tsc
```

### Run

```
node out/test/local
```

## webcrypto-socket

### Build

```
rollup -c
```

### Run

#### Tests combined with Chrome native webcrypto

Open `test/index.html`

#### Example

Open `dist/index.html`

### Related
- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)