import path from "node:path";
import url from "node:url";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import pkg from "./package.json" assert { type: "json" };

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const banner = [].join("\n");
const input = "src/index.ts";
const external = Object.keys(pkg.dependencies || {});

export default [
  {
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
  },
  {
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
  },
];