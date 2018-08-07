import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

let pkg = require("./package.json");

let banner = []

export default {
    input: "src/local/index.ts",
    plugins: [
        typescript({ typescript: require("typescript"), target: "esnext", removeComments: true }),
        nodeResolve({ jsnext: true, main: true }),
    ],
    external: [
        "2key-ratchet",
        "asn1js",
        "event-emitter",
        "graphene-pk11",
        "idb",
        "webcrypto-core",
        "node-webcrypto-ossl",
        "node-webcrypto-p11",
        "node-webcrypto-p11/built/subtle",
        "node-webcrypto-p11/built/cert_storage",
        "pcsclite",
        "pkcs11js",
        "pkijs",
        "pvtsutils",
        "pvutils",
        "request",
        "tslib",
        "tsprotobuf",
        "websocket",
        "events",
        "https",
        "url",
        "fs",
        "os",
        "path",
        "crypto",
    ],
    output: [
        {
            file: "dist/webcrypto-local.js",
            format: "cjs",
            banner: banner.join("\n"),
        }
    ]
};