import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import builtins from "rollup-plugin-node-builtins";
import commonjs from "rollup-plugin-commonjs";
import { dts, ts } from "rollup-plugin-dts";

const pkg = require("./package.json");

const banner = [].join("\n");
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies)
  .concat(["events"]);

// main
const main = {
  input,
  plugins: [
    ts({
      compilerOptions: {
        removeComments: true,
      },
    }),
  ],
  external,
  output: [
    {
      banner,
      file: pkg.main,
      format: "cjs",
    },
    {
      banner,
      file: pkg.module,
      format: "es",
    }
  ]
};

// types
const types = {
  input,
  plugins: [
    dts(),
  ],
  external,
  output: [
    {
      banner,
      file: pkg.types,
      format: "es"
    }
  ]
};

const browserExternals = {
  "protobufjs": "protobuf",
  "ws": "WebSocket",
  "node-fetch": "fetch",
};
const browser = [
  {
    input,
    plugins: [
      resolve(),
      commonjs(),
      builtins({
        events: true,
      }),
      ts({
        compilerOptions: {
          removeComments: true,
        },
      }),
    ],
    external: Object.keys(browserExternals),
    output: [
      {
        file: pkg.browser,
        format: "es",
        globals: browserExternals,
      }
    ]
  },
  {
    input: pkg.browser,
    plugins: [
      babel({
        babelrc: false,
        runtimeHelpers: true,
        presets: [
          [
            "@babel/env",
            {
              targets: {
                // ie: "11",
                chrome: "60",
              },
              useBuiltIns: "entry"
            }
          ]
        ],
        plugins: [
          "@babel/proposal-class-properties",
          "@babel/proposal-object-rest-spread",
        ],
      }),
    ],
    external: Object.keys(browserExternals),
    output: [
      {
        file: pkg.browser,
        format: "iife",
        name: "WebcryptoSocket",
        globals: browserExternals,
      },
    ],
  }
]

export default [
  main,
  types,
  ...browser,
];