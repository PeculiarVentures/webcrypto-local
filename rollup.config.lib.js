import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import builtins from "rollup-plugin-node-builtins";

let pkg = require("./package.json");

let banner = []

export default {
    entry: "src/socket/index.ts",
    // entry: "src/test/connection/client.ts",
    plugins: [
        typescript({ typescript: require("typescript"), target: "es6", module: "es6", removeComments: true }),
        builtins(),
        nodeResolve({ jsnext: true, main: true }),
    ],
    external: ["protobufjs"],
    globals: {
        "protobufjs": "protobuf",
    },
    banner: banner.join("\n"),
    targets: [
        {
            dest: "dist/webcrypto-socket.lib.js",
            moduleName: "WebcryptoSocket"
        }
    ]
};