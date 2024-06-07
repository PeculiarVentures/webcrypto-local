import { setEngine } from "2key-ratchet";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { inspect } from "util";
import * as server from "@webcrypto-local/server";

async function main() {
  // disable TLS certificate validation
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Set crypto engine for 2key-ratchet
  setEngine("WebCrypto NodeJS", crypto);

  const platform = os.platform();
  const FORTIFY_DATA_DIR = path.join(os.homedir(), ".fortify");
  const APP_DATA_DIR = platform === "win32"
    ? path.join(process.env.ProgramData!, "Fortify")
    : path.join(os.homedir(), ".fortify");
  const CERT_FILE = path.join(APP_DATA_DIR, "cert.pem");
  const KEY_FILE = path.join(APP_DATA_DIR, "cert.key");

  const pvpkcs11: string[] = [];
  let opensc: string | undefined;
  const providers: any[] = require(path.join(FORTIFY_DATA_DIR, "config.json")).providers;
  switch (platform) {
    case "win32":
      pvpkcs11.push(path.join(__dirname, "../utils/pvpkcs11.dll"));
      opensc = path.join(__dirname, "../utils/opensc/opensc-pkcs11.dll");
      break;
    case "darwin":
      pvpkcs11.push(path.join(__dirname, "../utils/libpvpkcs11.dylib"));
      opensc = path.join(__dirname, "../utils/opensc/opensc-pkcs11.so");
      break;
    case "linux":
    default:
    // nothing
  }

  const options: server.IServerOptions = {
    cert: fs.readFileSync(CERT_FILE),
    key: fs.readFileSync(KEY_FILE),
    storage: new server.MemoryStorage(),
    config: {
      cardConfigPath: path.join(__dirname, "..", "packages", "cards", "lib", "card.json"),
      pvpkcs11,
      opensc,
      providers: [
        ...providers,
        {
          name: "SoftHSM",
          lib: "/usr/local/lib/softhsm/libsofthsm2.so",
          slots: [
            0,
            1,
          ],
        },
      ],
      cards: [
        {
          name: "SafeNet5110 custom",
          atr: Buffer.from("3bd5180081313a7d8073c8211030", "hex"),
          libraries: [
            "/usr/local/lib/libeTPkcs11.dylib"
          ],
          readOnly: false,
          config: {
            template: {
              generate: {
                private: {
                  token: true,
                  sensitive: true,
                  extractable: false
                },
                public: {
                  token: false
                }
              },
              import: {
                x509: {
                  token: true
                }
              }
            }
          }
        },
      ],
    },
  };

  new server.LocalServer(options)
    .listen("127.0.0.1:31337")
    .on("listening", (e: any) => {
      console.log("Started at 127.0.0.1:31337");
    })
    .on("info", (level, source, message, data) => {
      if (data) {
        console.log(`${level.padEnd(7)}[${source}] ${message}`, inspect(data, false, 5, true));
      } else {
        console.log(`${level.padEnd(7)}[${source}] ${message}`);
      }
    })
    .on("token_new", (card) => {
      console.log("New token:", card);
    })
    .on("identity_changed", () => {
      console.log("Identity changed");
    })
    .on("error", (e: Error) => {
      console.error(e);
    })
    .on("notify", (p: any) => {
      switch (p.type) {
        case "2key": {
          // auto approve all connections
          p.resolve(true);
          break;
        }
        case "pin": {
          // auto PIN for all token's
          switch (p.label) {
            case "SafeNet U:39sp85MY":
              p.resolve("39sp85MY");
              break;
            case "My slot 0":
              p.resolve("12345");
              break;
            case "Rutoken U:12345678 A:87654321":
              p.resolve("12345678");
              break;
            default:
              p.resolve("123456");
              break;
            // throw new Error("Unknown token");
          }
          throw new Error("Oops");
          break;
        }
        default:
          throw new Error("Unknown type of notify");
      }
    })
    .on("close", (e: any) => {
      console.log("Close:", e.remoteAddress);
    });
}

main();
