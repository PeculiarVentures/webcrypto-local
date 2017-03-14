# webcrypto-local

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/2key-ratchet/master/LICENSE.md)


`webcrypto-local` is a cross platform service that provides access to PKCS#11 implementations over a `ProtoBuf` based protocol we call `webcrypto-socket`. It provides for message confidentiality and integrity via `2key-ratchet` and implements a security policy mechanism that allows the user to approve which peers can interact with it. 


## Build

```
npm run build
```

> __NOTE:__ Project is auto compiled after `npm install` command

### Server (webcrypto-local)

```
npm run build:server
```

### Client (webcrypto-socket)

```
npm run build:client
```

### Application

```
npm run build:app
```

## Run

### Server (webcrypto-local)

Starts local server `localhost:8081`
```
npm run start:server
```

### Application

Starts static server `localhost:8080`
```
npm run start:app
```

> __NOTE:__ Uses `node-static` for HTTP static server. To install `node-static` globally use command `sudo npm install node-static -g`

## Run

### Tests combined with Chrome native webcrypto

Open `test/index.html`

### Example

Open `dist/test.html`

## Related
- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)
