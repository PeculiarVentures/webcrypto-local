# webcrypto-local

`webcrypto-local` is a cross platform service that provides access to PKCS#11 implementations over a `ProtoBuf` based protocol we call `webcrypto-socket`. It provides for message confidentiality and integrity via `2key-ratchet` and implements a security policy mechanism that allows the user to approve which peers can interact with it.

## webcrypto-socket

#### Build

```
npm run build:ws
```

#### Build && Server

```
npm run server:ws
```

> NOTE: There is a [problem with ES5 PKIjs](https://github.com/PeculiarVentures/PKI.js/issues/113). To fix this you need to do steps described bellow

Enter to pkijs folder
```
cd node_modules/pkijs
```

Install `babel-polyfill`
```
npm i babel-polyfill
```

Update `src/index.js` by adding `require("babel-polyfill");` at the beginning.

Rebuild PKIjs (run command from `pkijs` folder)

```
npm run build
```

#### Tests combined with Chrome native webcrypto

Open `test/index.html`

#### Example

Open `dist/index.html`

### Related
- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)