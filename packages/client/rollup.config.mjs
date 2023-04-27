import path from "node:path";
import url from "node:url";
import resolve from "@rollup/plugin-node-resolve";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import builtins from "rollup-plugin-node-builtins";
import cleanup from "rollup-plugin-cleanup";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import typescript2 from "typescript";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import pkg from "./package.json" assert { type: "json" };

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const banner = [].join("\n");
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies || {});

// main
const main = {
  input,
  plugins: [
    typescript({
      check: true,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "ES2015",
        }
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
    },
  ],
};

function babelOptions(ie) {
  const targets = ie
    ? { ie: "11" }
    : { chrome: "60" };
  return {
    babelrc: false,
    runtimeHelpers: true,
    presets: [
      [
        "@babel/env",
        {
          targets,
          corejs: 3,
          useBuiltIns: "entry",
        }
      ]
    ],
    plugins: [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
    ],
  }
}

const browserExternals = {
  "protobufjs": "protobuf",
  "ws": "WebSocket",
};
const browser = [
  {
    input,
    plugins: [
      builtins(),
      resolve({
        mainFields: ["jsnext", "module", "main"],
        preferBuiltins: true,
      }),
      commonjs(),
      cleanup(),
      typescript({
        typescript: typescript2,
        check: true,
        clean: true,
        tsconfigOverride: {
          compilerOptions: {
            module: "ES2015",
          }
        },
      }),
    ],
    external: Object.keys(browserExternals),
    output: [
      {
        file: pkg["browser:es5"],
        format: "es",
        globals: browserExternals,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [
              ["@babel/preset-env", {
                targets: {
                  chrome: "60"
                },
              }],
            ],
          }),
        ]
      },
      // ES2015
      {
        banner,
        footer: "self.WebcryptoSocket=WebcryptoSocket;",
        file: pkg["browser"],
        format: "iife",
        name: "WebcryptoSocket",
        globals: browserExternals,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [
              ["@babel/preset-env", {
                targets: {
                  chrome: "60"
                },
              }],
            ],
          }),
        ]
      },
      {
        banner,
        footer: "self.WebcryptoSocket=WebcryptoSocket;",
        file: pkg["browser:min"],
        format: "iife",
        name: "WebcryptoSocket",
        globals: browserExternals,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [
              ["@babel/preset-env", {
                targets: {
                  chrome: "60"
                },
              }],
            ],
          }),
          terser(),
        ]
      },
      // ES5
      {
        banner,
        file: pkg["browser:es5"],
        format: "iife",
        name: "WebcryptoSocket",
        globals: browserExternals,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [
              ["@babel/preset-env", {
                targets: {
                  ie: "11"
                },
              }],
            ],
          }),
        ]
      },
      {
        banner,
        file: pkg["browser:es5:min"],
        format: "iife",
        name: "WebcryptoSocket",
        globals: browserExternals,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [
              ["@babel/preset-env", {
                targets: {
                  ie: "11"
                },
              }],
            ],
          }),
          terser(),
        ]
      },
    ]
  },
]

const types = {
  input,
  external,
  plugins: [
    dts({
      tsconfig: path.resolve(__dirname, "./tsconfig.compile.json"),
      compilerOptions: {
        removeComments: false,
      }
    })
  ],
  output: [
    {
      banner,
      file: pkg.types,
    }
  ]
};

export default [
  main,
  ...browser,
  types,
];