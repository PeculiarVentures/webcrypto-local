import nodeResolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";
import builtins from "rollup-plugin-node-builtins";

let pkg = require("./package.json");

let banner = []

export default {
    input: "src/socket/index.ts",
    // entry: "src/test/connection/client.ts",
    plugins: [
        typescript({ typescript: require("typescript"), target: "es5", removeComments: true }),
        builtins(),
        nodeResolve({ jsnext: true, main: true }),
    ],
    external: ["protobufjs"],
    output: [
        {
            file: "dist/webcrypto-socket.js",
            format: "cjs",
            globals: {
                "protobufjs": "protobuf",
            },
            banner: banner.join("\n"),
        }
    ]
};