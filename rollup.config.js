import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import builtins from "rollup-plugin-node-builtins";
import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

const dependencies = Object.keys(pkg.dependencies);
let banner = []

export default [
  // ESNEXT bundled file for webcrypto-socket
  {
    input: "src/socket/index.ts",
    plugins: [
      typescript({ typescript: require("typescript"), target: "esnext", removeComments: true }),
      // Allows node_modules resolution
      // resolve(),
      // commonjs(),
      // builtins(),
    ],
    // Specify here external modules which you don"t want to include in your bundle (for instance: "lodash", "moment" etc.)
    // https://rollupjs.org/guide/en#external-e-external
    // external: ["protobufjs"],
    external: dependencies.concat(["events"]),
    output: [
      {
        file: pkg.module,
        format: "es",
      }
    ]
  },
  // ES5 bundled file for webcrypto-socket
  {
    input: pkg.module,
    plugins: [
      resolve(),
      babel({
        babelrc: false,
        // include: dependencies.map(item => `node_modules/${item}/**`).concat(["src/**"]),
        runtimeHelpers: true,
        presets: [
          [
            "@babel/env",
            {
              targets: {
                ie: "11",
                // chrome: "60",
              },
              useBuiltIns: "usage"
            }
          ]
        ],
        plugins: [
          "@babel/proposal-class-properties",
          "@babel/proposal-object-rest-spread",
        ],
      }),
      commonjs(),
      builtins(),
    ],
    external: ["protobufjs"],
    output: [
      {
        file: pkg.browser,
        format: "iife",
        name: "WebcryptoSocket",
        globals: {
          "protobufjs": "protobuf",
        },
      },
    ],
  },
  // ES bundled file for webcrypto-local
  {
    input: "src/local/index.ts",
    plugins: [
      typescript({ typescript: require("typescript"), target: "esnext", removeComments: true }),
    ],
    external: dependencies
      .concat(["events", "https", "url", "fs", "os", "path", "crypto"]),
    output: [
      {
        file: pkg.main,
        format: "cjs",
      }
    ]
  },
];
