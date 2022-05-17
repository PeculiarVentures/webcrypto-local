# `@webcrypto-local/client`

[![Test](https://github.com/PeculiarVentures/webcrypto-local/actions/workflows/test.yml/badge.svg)](https://github.com/PeculiarVentures/webcrypto-local/actions/workflows/test.yml)

A package of `webcrypto-local` framework. WebSocket client

## Installation

```bash
npm install --save-dev @webcrypto-local/client
```

## Usage

```js
const client = require('@webcrypto-local/client');
```

## Browser

```html
<!-- Babel Polyfill -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.8.3/polyfill.min.js"></script>
<!-- Crypto -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/asmCrypto/2.3.2/asmcrypto.all.es5.min.js"></script>
<script src="https://cdn.rawgit.com/indutny/elliptic/master/dist/elliptic.min.js"></script>
<script src="https://unpkg.com/webcrypto-liner@1.1.4/build/webcrypto-liner.shim.min.js"></script>
<!-- WebCrypto Socket -->
<script src="https://unpkg.com/protobufjs@6.8.8/dist/protobuf.min.js"></script>
<script src="https://unpkg.com/@webcrypto-local/client@1.0.14/build/webcrypto-socket.min.js"></script>
```