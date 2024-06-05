# webcrypto-local

[![Coverage Status](https://coveralls.io/repos/github/PeculiarVentures/webcrypto-local/badge.svg?branch=master)](https://coveralls.io/github/PeculiarVentures/webcrypto-local?branch=update-deps)
[![Test](https://github.com/PeculiarVentures/webcrypto-local/actions/workflows/test.yml/badge.svg)](https://github.com/PeculiarVentures/webcrypto-local/actions/workflows/test.yml)

`webcrypto-local` is a cross platform service that provides access to PKCS#11
implementations over a `ProtoBuf` based protocol we call `webcrypto-socket`. It
provides for message confidentiality and integrity via `2key-ratchet` and
implements a security policy mechanism that allows the user to approve which
peers can interact with it.

## webcrypto-socket

#### Build

```
npm run build
```

#### Tests

```
npm test
```

## C++ Node.js Addons

This project uses C++ Node.js addons. When building on Node.js 20, you may
encounter issues with `node-gyp`. It is recommended to use `node-gyp` version 10
or higher to avoid these issues.

If you're using `nvm` to manage Node.js versions, you can switch to Node.js 10
by running `nvm use 10`. If you don't have Node.js 10 installed, you can install
it by running `nvm install 10`.

Please ensure that you have the necessary build tools installed on your system
to compile C++ code. On Windows, you can install the necessary build tools by
running `npm install --global --production windows-build-tools`. On Unix-based
systems, you'll need to have `gcc` and `make` installed. You can install these
by using your system's package manager.

### Related

- [2key-ratchet](https://github.com/PeculiarVentures/2key-ratchet)
- [pvpkcs11](https://github.com/PeculiarVentures/pvpkcs11)
- [node-webcrypto-p11](https://github.com/PeculiarVentures/node-webcrypto-p11)
